import { Scope, SourceFile, PropertyDeclarationStructure, ParameterDeclaration, DecoratorStructure, JSDocStructure, ClassDeclaration } from 'ts-simple-ast';
import { Rest, RestObject } from '../index';
import { Field, SObjectDescribe, ChildRelationship } from '../main/lib/sObjectDescribe';
import { SFieldProperties } from '../main/lib/sObjectDecorators';
import { Spinner } from 'cli-spinner';
import { SObjectConfig, FieldMapping } from './sObjectConfig';

const superClass = 'RestObject';
export class SObjectGenerator {

    public sObjectConfigs: SObjectConfig[];
    public classInterfaceMap: Map<string, string>;
    public sourceFile: SourceFile;
    public spinner: any;

    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} sObjectConfigs: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor (sourceFile: SourceFile, sObjectConfigs: SObjectConfig[]) {
        this.sObjectConfigs = sObjectConfigs;
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
                { name: 'SObject' },
                { name: 'sField' }
            ]
        });

        for (let i = 0; i < this.sObjectConfigs.length; i++) {
            let className = this.sanatizeClassName(this.sObjectConfigs[i]);
            let interfaceName = this.generatePropInterfaceName(className);
            this.classInterfaceMap.set(className, interfaceName);
        }

        for (let i = 0; i < this.sObjectConfigs.length; i++) {

            await this.generateSObjectClass(this.sObjectConfigs[i]);

        }
        }catch (e) {
            this.spinner.stop();
            throw e;
        }
        this.spinner.stop();
    }

    // class generation
    public async generateSObjectClass (sobConfig: SObjectConfig): Promise<void> {

        this.spinner.setSpinnerTitle(`Generating: ${sobConfig.apiName}`);
        let sobDescribe: SObjectDescribe;
        try {
            sobDescribe = await this.retrieveDescribe(sobConfig.apiName);
        }catch (e) {
            throw new Error(`Could not retreive describe metadata for ${sobConfig.apiName}. Check SObject spelling and authorization `);
        }

        let props: PropertyDeclarationStructure[] = [];

        // generate props from fields & children
        props.push(...this.generateChildrenProps(sobConfig, sobDescribe.childRelationships));
        props.push(...this.generateFieldProps(sobConfig, sobDescribe.fields));

        let className = this.sanatizeClassName(sobConfig);

        this.generateInterface(className, props);

        let classDeclaration = this.generateClass(sobConfig, className, props);

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
            returnType: this.classInterfaceMap.get(className)
        });

        immutableMethod.setBodyText(
            `return this.clone();`
        );
        classDeclaration.forget();

    }

    private generateInterface (className: string, properties: PropertyDeclarationStructure[]) {
        let propsInterface = this.sourceFile.addInterface({
            name: this.classInterfaceMap.get(className),
            isExported: true,
            docs: [{description: `Immutable Property Interface for ${className}` }]
        });

        properties.forEach(prop => {
            // this is quite hackish and should be refactored ASAP
            let isArr = false;
            let pType = prop.type;
            if (prop.type.indexOf('[]') > -1) {
                isArr = true;
                pType = pType.replace('[]','');
            }
            let interfaceType = this.classInterfaceMap.get(pType);
            let ip = propsInterface.addProperty({
                name: prop.name,
                type: interfaceType ? (isArr ? `${interfaceType}[]` : interfaceType) : prop.type,
                isReadonly: true
            });
            ip.setIsOptional(true);
        });
        propsInterface.forget();
    }

    private generateClass (sobConfig: SObjectConfig, className: string, props: PropertyDeclarationStructure[]): ClassDeclaration {
        let propInterfaceName = this.classInterfaceMap.get(className);

        let classDeclaration = this.sourceFile.addClass({
            name: className,
            extends: superClass,
            isExported: true,
            properties: props,
            implements: [propInterfaceName],
            docs: [{description: `Generated class for ${sobConfig.apiName}` }]
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

        constr.setBodyText(`super('${sobConfig.apiName}');
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

    private sanatizeClassName (sobConfig: SObjectConfig): string {
        if (sobConfig.autoConvertNames) {
            return sobConfig.apiName.replace('__c', '').replace('_', '');
        }
        return sobConfig.apiName;
    }

    private sanatizeProperty (sobConfig: SObjectConfig, apiName: string, reference: boolean): string {

        let fieldMapping;
        if (sobConfig.fieldMappings) {
            fieldMapping = sobConfig.fieldMappings.find(mapping => {
                return mapping.apiName.toLowerCase() === apiName.toLowerCase();
            });
        }

        if (fieldMapping) {
            return fieldMapping.propName;
        }else if (sobConfig.autoConvertNames) {
            let s = apiName.replace('__c', '').replace('__r', '').replace(/_/g, '');
            return apiName.charAt(0).toLowerCase() + s.slice(1) + (reference && !apiName.endsWith('Id') ? 'Id' : '');
        }else {
            return apiName;
        }
    }

    private generateChildrenProps (sobConfig: SObjectConfig, children: ChildRelationship[]): PropertyDeclarationStructure[] {
        let props = [];
        children.forEach(child => {
            try {
                let relatedSobIndex = this.sObjectConfigs.findIndex(config => {
                    return config.apiName.toLowerCase() === child.childSObject.toLowerCase();
                });
                // don't generate if not in the list of types or ??
                if (relatedSobIndex === -1
                || child.childSObject === sobConfig.apiName
                || child.deprecatedAndHidden === true
                || child.relationshipName === null) {
                    return;
                }

                let referenceClass = this.sanatizeClassName(this.sObjectConfigs[relatedSobIndex]);

                let decoratorProps = {
                    apiName: child.relationshipName,
                    readOnly: true,
                    required: false,
                    childRelationship: true,
                    reference: referenceClass
                };

                props.push({
                    name: this.sanatizeProperty(sobConfig, child.relationshipName, false),
                    type: `${referenceClass}[]`,
                    scope: Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ]
                });
            }catch (e) {
                throw e;
            }
        });
        return props;
    }

    private generateFieldProps (sobConfig: SObjectConfig, fields: Field[]): PropertyDeclarationStructure[] {
        let props = [];
        // add members
        fields.forEach(field => {

            try {
                let docs: JSDocStructure[] = [];
                if (field.inlineHelpText != null) {
                    docs.push({ description: field.inlineHelpText });
                }

                let relatedSobIndex = this.sObjectConfigs.findIndex(config => {
                    return config.apiName === field.referenceTo[0];
                });

                // only include reference types if we are also generating the referenced class
                if (
                    field.type === 'reference'
                    && (
                        relatedSobIndex > -1
                    )
                    && field.relationshipName !== null
                ) {

                    let referenceClass: string;

                    if (field.referenceTo.length > 1) {
                        referenceClass = 'Name'; // polymorphic object
                    } else {
                        referenceClass = this.sanatizeClassName(this.sObjectConfigs[relatedSobIndex]);
                    }

                    let decoratorProps = {
                        apiName: field.relationshipName,
                        readOnly: true,
                        required: false,
                        childRelationship: false,
                        reference: referenceClass
                    };

                    props.push({
                        name: this.sanatizeProperty(this.sObjectConfigs[relatedSobIndex], field.relationshipName, false),
                        type: referenceClass,
                        scope: Scope.Public,
                        decorators: [
                            this.generateDecorator(decoratorProps)
                        ],
                        docs: docs
                    });
                }

                let prop: PropertyDeclarationStructure = {
                    name: this.sanatizeProperty(sobConfig, field.name, field.type === 'reference'),
                    type: this.mapSObjectType(field.type),
                    scope: Scope.Public,
                    decorators: [this.getDecorator(field)],
                    docs: docs
                };

                props.push(prop);
            }catch (e) {
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
