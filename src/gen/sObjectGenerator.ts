import { Scope, SourceFile, PropertyDeclarationStructure, ParameterDeclaration, DecoratorStructure, JSDocStructure, ClassDeclaration } from 'ts-simple-ast';
import { Rest, RestObject } from '../index';
import { Field, SObjectDescribe, ChildRelationship } from '../main/lib/sObjectDescribe';
import { SFieldProperties } from '../main/lib/sObjectDecorators';
import { Spinner } from 'cli-spinner';

const superClass = 'RestObject';

export class SObjectGenerator {

    public apiNames: string[];
    public classInterfaceMap: Map<string, string>;
    public sourceFile: SourceFile;
    public spinner: any;

    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} apiNames: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor (sourceFile: SourceFile, apiNames: string[]) {
        this.apiNames = apiNames;
        this.classInterfaceMap = new Map<string,string>();
        this.sourceFile = sourceFile;
    }

    public async generateFile () {
        this.spinner = new Spinner({
            text: 'warming up...',
            stream: process.stderr,
            onTick: function (msg) {
                this.clearLine(this.stream);
                this.stream.write(msg);
            }
        });
        this.spinner.setSpinnerString(5);
        this.spinner.setSpinnerDelay(20);
        this.spinner.start();

        try {
        // add imports
        this.sourceFile.addImport({
            moduleSpecifier: 'ts-force',
            namedImports: [
                { name: 'RestObject' },
                { name: 'sField' }
            ]
        });

        for (let i = 0; i < this.apiNames.length; i++) {

            await this.generateSObjectClass(this.apiNames[i]);

        }
        }catch (e) {
            this.spinner.stop();
            throw e;
        }
        this.spinner.stop();
    }

    // class generation
    public async generateSObjectClass (apiName: string): Promise<void> {
        this.spinner.setSpinnerTitle(`Generating: ${apiName}`);
        let sobDescribe: SObjectDescribe;
        try {
            sobDescribe = await this.retrieveDescribe(apiName);
        }catch (e) {
            throw new Error(`Could not retreive describe metadata for ${apiName}. Check SObject spelling and authorization `);
        }

        let props: PropertyDeclarationStructure[] = [];

        // generate props from fields & children
        props.push(...this.generateChildrenProps(apiName, sobDescribe.childRelationships));
        props.push(...this.generateFieldProps(sobDescribe.fields));

        let className = this.sanatizeClassName(apiName);
        let interfaceName = this.generatePropInterfaceName(className);
        this.classInterfaceMap.set(className, interfaceName);

        this.generateInterface(className, props);
        let classDeclaration = this.generateClass(apiName, className, props);

        const qryMethod = classDeclaration.addMethod({
            name: 'retrieve',
            isStatic: true,
            scope: Scope.Public,
            parameters: [
                { name: 'qry', type: 'string' }
            ],
            returnType: `Promise<${className}[]>`,
            isAsync: true
        });

        qryMethod.setBodyText(
            `return await ${superClass}.query<${className}>(${className}, qry);`
        );

        const immutableMethod = classDeclaration.addMethod({
            name: 'toImmutable',
            scope: Scope.Public,
            returnType: interfaceName
        });

        immutableMethod.setBodyText(
            `return this.clone();`
        );

    }

    private generateInterface (className: string, properties: PropertyDeclarationStructure[]) {
        let propsInterface = this.sourceFile.addInterface({
            name: this.classInterfaceMap.get(className),
            isExported: true,
            docs: [{description: `Immutable Property Interface for ${className}` }]
        });

        properties.forEach(prop => {
            let ip = propsInterface.addProperty({
                name: prop.name,
                type: prop.type,
                isReadonly: true
            });
            ip.setIsOptional(true);
        });
    }

    private generateClass (apiName: string, className: string, props: PropertyDeclarationStructure[]): ClassDeclaration {
        let propInterfaceName = this.classInterfaceMap.get(className);

        let classDeclaration = this.sourceFile.addClass({
            name: className,
            extends: superClass,
            isExported: true,
            properties: props,
            implements: [propInterfaceName],
            docs: [{description: `Generated class for ${apiName}` }]
        });

        const interfaceParamName = 'fields';
        const constr = classDeclaration.addConstructor();
        const param = constr.addParameter({
            name: interfaceParamName,
            type: propInterfaceName
        });
        param.setIsOptional(true);

        const propsInit = props.map(prop => {
            return `this.${prop.name} = void 0;`;
        }).join('\n');

        constr.setBodyText(`super('${apiName}');
        ${propsInit}
        Object.assign(this,${interfaceParamName})`);

        return classDeclaration;
    }

    private async retrieveDescribe (apiName: string): Promise<SObjectDescribe> {
        return await Rest.Instance.getSObjectDescribe(apiName);
    }

    private generatePropInterfaceName (className: string) {
        return `${className}Fields`;
    }

    private sanatizeClassName (apiName: string): string {
        return apiName.replace('__c', '').replace('_', '');
    }

    private generateChildrenProps (apiName: string, children: ChildRelationship[]): PropertyDeclarationStructure[] {
        let props = [];
        children.forEach(child => {
            try {
                // don't generate if not in the list of types or ??
                if (this.apiNames.indexOf(child.childSObject) === -1
                    || child.childSObject === apiName
                || child.deprecatedAndHidden === true
                || child.relationshipName === null) {
                    return;
                }

                let referenceClass = this.sanatizeClassName(child.childSObject);

                let decoratorProps = {
                    apiName: child.relationshipName,
                    readOnly: true,
                    required: false,
                    childRelationship: true,
                    reference: referenceClass
                };

                props.push({
                    name: RestObject.sanatizeProperty(child.relationshipName, false),
                    type: `${referenceClass}[]`,
                    scope: Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ]
                });
            }catch (e) {
                console.log(child);
                throw e;
            }
        });
        return props;
    }

    private generateFieldProps (fields: Field[]): PropertyDeclarationStructure[] {
        let props = [];
        // add members
        fields.forEach(field => {

            try {
                let docs: JSDocStructure[] = [];
                if (field.inlineHelpText != null) {
                    docs.push({ description: field.inlineHelpText });
                }

                // only include reference types if we are also generating the referenced class
                if (
                    field.type === 'reference'
                    && (
                        this.apiNames.indexOf(field.referenceTo[0]) > -1
                        || (field.referenceTo.length > 1 && this.apiNames.indexOf('Name') > -1)
                    )
                    && field.relationshipName !== null
                ) {

                    let referenceClass: string;

                    if (field.referenceTo.length > 1) {
                        referenceClass = 'Name'; // polymorphic object
                    } else {
                        referenceClass = this.sanatizeClassName(field.referenceTo[0]);
                    }

                    let decoratorProps = {
                        apiName: field.relationshipName,
                        readOnly: true,
                        required: false,
                        childRelationship: false,
                        reference: referenceClass
                    };

                    props.push({
                        name: RestObject.sanatizeProperty(field.relationshipName, false),
                        type: referenceClass,
                        scope: Scope.Public,
                        decorators: [
                            this.generateDecorator(decoratorProps)
                        ],
                        docs: docs
                    });
                }

                let prop: PropertyDeclarationStructure = {
                    name: RestObject.sanatizeProperty(field.name, field.type === 'reference'),
                    type: this.mapSObjectType(field.type),
                    scope: Scope.Public,
                    decorators: [this.getDecorator(field)],
                    docs: docs
                };

                props.push(prop);
            }catch (e) {
                console.log(field);
                throw e;
            }
        });
        return props;
    }

    private mapSObjectType (sfType: string): string {
        switch (sfType) {
            case 'datetime':
            case 'date':
            return 'Date';
            case 'boolean':
            return 'boolean';
            case 'double':
            case 'integer':
            case 'currency':
            return 'number';
            case 'reference':
            case 'string':
            case 'picklist':
            case 'id':
            default:
            return 'string';
        }
    }

    private getDecorator (field: Field): DecoratorStructure {
        let decoratorProps = {
            apiName: field.name,
            readOnly: field.updateable === false && field.createable === false,
            required: (field.createable || field.updateable) && field.nillable === false,
            childRelationship: false,
            reference: null,
            salesforceLabel: field.label,
            salesforceType: field.type
        };

        return this.generateDecorator(decoratorProps);
    }

    private generateDecorator (decoratorProps: any) {
        let ref = decoratorProps.reference != null ? `()=>{return ${decoratorProps.reference}}` : 'undefined';
        return {
            name: `sField`,
            arguments: [
                `{apiName: '${decoratorProps.apiName}', readOnly: ${decoratorProps.readOnly}, required: ${decoratorProps.required}, reference:${ref}, childRelationship: ${decoratorProps.childRelationship}, salesforceType: '${decoratorProps.salesforceType}'}`
            ]
        };
    }

}
