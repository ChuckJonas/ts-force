
import { ChildRelationship, Field, Rest, SalesforceFieldType, SFieldProperties, SObjectDescribe } from '../../ts-force';
import { ClassDeclaration, DecoratorStructure, JSDocStructure, PropertyDeclarationStructure, Scope, SourceFile, ImportDeclarationStructure, StructureKind, WriterFunctions } from 'ts-morph';
import { SObjectConfig } from './config';
import { cleanAPIName, replaceSource } from './util';

export const TS_FORCE_IMPORTS: ImportDeclarationStructure = {
    kind: StructureKind.ImportDeclaration,
    moduleSpecifier: 'ts-force',
    namedImports: [
        { name: 'Rest' },
        { name: 'RestObject' },
        { name: 'SObject' },
        { name: 'sField' },
        { name: 'SalesforceFieldType' },
        { name: 'SFLocation' },
        { name: 'SFieldProperties' },
        { name: 'FieldResolver' },
        { name: 'SOQLQueryParams' },
        { name: 'buildQuery' },
        { name: 'FieldProps' },
        { name: 'PicklistConst' }
    ]
};

const SUPER_CLASS = 'RestObject';

interface SalesforceDecoratorProps {
    apiName: string;
    createable: boolean;
    updateable: boolean;
    required: boolean;
    externalId: boolean;
    childRelationship: boolean;
    reference: any;
    salesforceLabel: string;
    salesforceType: SalesforceFieldType;
}

export class SObjectGenerator {

    private sObjectConfig: SObjectConfig;
    private allConfigsMap: Map<string, SObjectConfig>;
    private dependsOn: Set<string>;

    private sourceFile: SourceFile;
    private singleFileMode: boolean;

    private client;
    private fieldsTypeAlias: string;

    private pickLists: Map<string, [string, string][]>;
    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} sObjectConfigs: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor (out: string | SourceFile, sObjectConfig: SObjectConfig, allConfigs: SObjectConfig[]) {
        this.sObjectConfig = sObjectConfig;
        this.pickLists = new Map<string, [string, string][]>();
        if (typeof out === 'string') {
            this.sourceFile = replaceSource(out);
            this.singleFileMode = false;
        }else {
            this.sourceFile = out;
            this.singleFileMode = true;
        }

        this.client = new Rest();
        this.fieldsTypeAlias = `${sObjectConfig.className}Fields`;

        this.allConfigsMap = new Map(
            allConfigs.map<[string, SObjectConfig]>(x => [x.apiName.toLowerCase(), x])
        );
        this.dependsOn = new Set<string>();

    }

    public async generateFile () {

        try {
            // add imports

            this.sourceFile.addTypeAlias({
                name: this.fieldsTypeAlias,
                isExported: true, // to maintain backwords compat
                type: `Partial<FieldProps<${this.sObjectConfig.className}>>`
            });

            await this.generateSObjectClass(this.sObjectConfig);

            if (!this.singleFileMode) {
                // ts-imports must be added by controlling process
                this.sourceFile.addImportDeclaration(TS_FORCE_IMPORTS);
                this.sourceFile.addImportDeclaration({
                    moduleSpecifier: './',
                    namedImports: [...this.dependsOn].filter(c => c !== this.sObjectConfig.className).map(c => {
                        return { name: c };
                    })
                });
            }

        } catch (e) {
            throw e;
        }

        return this.sourceFile;
    }

    // class generation
    public async generateSObjectClass (sobConfig: SObjectConfig): Promise<void> {

        let sobDescribe: SObjectDescribe;
        try {
            sobDescribe = await this.retrieveDescribe(sobConfig.apiName);
        } catch (e) {
            throw new Error(`Could not retrieve describe metadata for ${sobConfig.apiName}. Check SObject spelling and authorization `);
        }

        let props: PropertyDeclarationStructure[] = [];

        // generate props from fields & children
        props.push(...this.generateChildrenProps(sobConfig, sobDescribe.childRelationships));
        props.push(...this.generateFieldProps(sobConfig, sobDescribe.fields));

        let className = this.sObjectConfig.className;

        let classDeclaration = this.generateClass(sobConfig, className, props);

        classDeclaration.addProperty({
            name: 'API_NAME',
            scope: Scope.Public,
            isStatic: true,
            type: `'${sobConfig.apiName}'`,
            initializer: `'${sobConfig.apiName}'`
        });

        classDeclaration.addProperty({
            name: '_TYPE_',
            scope: Scope.Public,
            isReadonly: true,
            type: `'${sobConfig.apiName}'`,
            initializer: `'${sobConfig.apiName}'`
        });

        classDeclaration.addProperty({
            name: '_fields',
            scope: Scope.Private,
            isStatic: true,
            type: `{[P in keyof FieldProps<${className}>]: SFieldProperties;}`
        });

        classDeclaration.addGetAccessor({
            name: 'FIELDS',
            scope: Scope.Public,
            isStatic: true,

            statements: `return this._fields = this._fields ? this._fields : ${className}.getPropertiesMeta<FieldProps<${className}>,${className}>(${className})`
        });

        classDeclaration.addMethod({
            name: 'retrieve',
            isStatic: true,
            scope: Scope.Public,
            parameters: [
                { name: 'qryParam', type: `((fields: FieldResolver<${className}>) => SOQLQueryParams) | string` },
                { name: 'restInstance', type: 'Rest', hasQuestionToken: true }
            ],
            returnType: `Promise<${className}[]>`,
            isAsync: true,
            statements: `
            let qry = typeof qryParam === 'function' ? buildQuery(${className}, qryParam) : qryParam;
            return await ${SUPER_CLASS}.query<${className}>(${className}, qry, restInstance);
            `
        });

        classDeclaration.addMethod({
            name: 'fromSFObject',
            isStatic: true,
            scope: Scope.Public,
            parameters: [
                { name: 'sob', type: 'SObject' }
            ],
            returnType: `${className}`,
            statements: `return new ${className}().mapFromQuery(sob);`
        });

        if (this.sObjectConfig.generatePicklists) {
            this.generatePickistConst(classDeclaration);
        }

        classDeclaration.forget();
    }

    private async retrieveDescribe (apiName: string): Promise<SObjectDescribe> {
        return await this.client.getSObjectDescribe(apiName);
    }

    private generateClass (sobConfig: SObjectConfig, className: string, props: PropertyDeclarationStructure[]): ClassDeclaration {

        let classDeclaration = this.sourceFile.addClass({
            name: className,
            extends: SUPER_CLASS,
            isExported: true,
            properties: props,
            // implements: [propInterfaceName],
            docs: [{ description: `Generated class for ${sobConfig.apiName}` }]
        });

        const interfaceParamName = 'fields';
        const constr = classDeclaration.addConstructor();
        constr.addParameter({
            name: interfaceParamName,
            type: this.fieldsTypeAlias,
            hasQuestionToken: true
        });
        constr.addParameter({
            name: 'restInstance',
            type: 'Rest',
            hasQuestionToken: true
        });

        const propsInit = props.map(prop => {
            return `this.${prop.name} = void 0;`;
        }).join('\n');

        let constructorBody = `super('${sobConfig.apiName}', restInstance);
                            ${propsInit}
                            this.initObject(${interfaceParamName});
                            return new Proxy(this, this.safeUpdateProxyHandler);`;

        constr.setBodyText(constructorBody);

        return classDeclaration;
    }

    private generatePickistConst (classDeclaration: ClassDeclaration) {
        if (this.pickLists.size) {
            let picklistsConst = classDeclaration.addProperty({
                name: 'PICKLIST',
                scope: Scope.Public,
                isStatic: true,
                isReadonly: true
            });

            let picklistConsts = {};

            this.pickLists.forEach((values, field) => {
                picklistConsts[field] = WriterFunctions.object(values.reduce((obj, pv) => {
                    obj[pv[0]] = writer => writer.quote(pv[1]);
                    return obj;
                }, {}));
            });

            let x = writer => {
                WriterFunctions.object(picklistConsts)(writer);
                writer.write(' as const');
            };

            picklistsConst.setInitializer(x);
        }
    }

    private sanitizeProperty (sobConfig: SObjectConfig, apiName: string, reference: boolean): string {
        let fieldMapping;
        if (sobConfig.fieldMappings) {
            fieldMapping = sobConfig.fieldMappings.find(mapping => {
                return mapping.apiName.toLowerCase() === apiName.toLowerCase();
            });
        }

        if (fieldMapping) {
            return fieldMapping.propName;
        } else if (sobConfig.autoConvertNames) {
            let s = cleanAPIName(apiName);
            return apiName.charAt(0).toLowerCase() + s.slice(1) + (reference && !apiName.endsWith('Id') ? 'Id' : '');
        } else {
            return apiName;
        }
    }

    private sanatizePicklistName (picklistLabel: string, usedNames: Set<string>): string {
        let name = picklistLabel.split(' ').join('_');
        name = name.replace(/[^0-9a-z_]/gi, '');
        if (Number.isInteger(Number(name.charAt(0)))) {
            name = '_' + name;
        }
        name = name.toUpperCase();
        name = this.makeNameUnquie(name, usedNames);
        return name;
    }

    private makeNameUnquie (name: string, usedNames: Set<string>): string {
        while (usedNames.has(name)) {
            name = `${name}_dup`;
        }
        return name;
    }

    private generateChildrenProps (sobConfig: SObjectConfig, children: ChildRelationship[]): PropertyDeclarationStructure[] {
        const uniqueNames = new Set<string>();
        let props = [];
        children.forEach(child => {
            try {
                let relatedSobConfig = this.allConfigsMap.get(child.childSObject.toLowerCase());

                // don't generate if not in the list of types or ??
                if (!relatedSobConfig
                    || child.childSObject === sobConfig.apiName
                    || child.deprecatedAndHidden === true
                    || child.relationshipName === null) {
                    return;
                }

                this.dependsOn.add(relatedSobConfig.className);

                let referenceClass = relatedSobConfig.className;

                let decoratorProps: SalesforceDecoratorProps = {
                    apiName: child.relationshipName,
                    required: false,
                    createable: false,
                    updateable: false,
                    childRelationship: true,
                    reference: referenceClass,
                    externalId: false,
                    salesforceLabel: child.relationshipName,
                    salesforceType: SalesforceFieldType.REFERENCE
                };
                let propName = this.sanitizeProperty(sobConfig, child.relationshipName, false);
                propName = this.makeNameUnquie(propName, uniqueNames);
                uniqueNames.add(propName);
                props.push({
                    name: propName,
                    type: `${referenceClass}[]`,
                    scope: Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ]
                });
            } catch (e) {
                throw e;
            }
        });
        return props;
    }

    private generateFieldProps (sobConfig: SObjectConfig, fields: Field[]): PropertyDeclarationStructure[] {
        let props = [];
        const uniqueNames = new Set<string>();
        // add members
        fields.forEach(field => {

            try {
                let docs: JSDocStructure[] = [];
                if (field.inlineHelpText != null) {
                    docs.push({ kind: StructureKind.JSDoc, description: field.inlineHelpText });
                }

                // only include reference types if we are also generating the referenced class
                if (
                    field.referenceTo.length > 0 &&
                    this.allConfigsMap.has(field.referenceTo[0].toLowerCase()) &&
                    field.type === SalesforceFieldType.REFERENCE &&
                    field.relationshipName !== null
                ) {
                    let relatedSobConfig = this.allConfigsMap.get(field.referenceTo[0].toLowerCase());
                    this.dependsOn.add(relatedSobConfig.className);
                    let referenceClass: string;

                    if (field.referenceTo.length > 1) {
                        referenceClass = 'Name'; // polymorphic object
                    } else {
                        referenceClass = relatedSobConfig.className;
                    }

                    let decoratorProps: SalesforceDecoratorProps = {
                        apiName: field.relationshipName,
                        required: false,
                        createable: false,
                        updateable: false,
                        childRelationship: false,
                        reference: referenceClass,
                        externalId: false,
                        salesforceLabel: field.label,
                        salesforceType: SalesforceFieldType.REFERENCE
                    };

                    props.push({
                        name: this.sanitizeProperty(relatedSobConfig, field.relationshipName, false),
                        type: referenceClass,
                        scope: Scope.Public,
                        hasExclamationToken: true,
                        decorators: [
                            this.generateDecorator(decoratorProps)
                        ],
                        docs: docs
                    });
                }

                let propName = this.sanitizeProperty(sobConfig, field.name, field.type === SalesforceFieldType.REFERENCE);
                propName = this.makeNameUnquie(propName, uniqueNames);
                uniqueNames.add(propName);

                let prop: PropertyDeclarationStructure = {
                    kind: StructureKind.Property,
                    name: propName,
                    type: this.mapSObjectType(field.type),
                    scope: Scope.Public,
                    isReadonly: !(field.createable || field.updateable),
                    decorators: [this.getDecorator(field)],
                    docs: docs
                };

                if (this.sObjectConfig.generatePicklists) {
                    if (field.picklistValues.length) {
                        let usedNames = new Set<string>();
                        let values = field.picklistValues.map<[string, string]>(pv => {
                            let name = this.sanatizePicklistName(pv.value, usedNames);
                            usedNames.add(name);
                            return [name, pv.value];
                        });
                        this.pickLists.set(prop.name, values);

                        // enforce picklist values
                        //  does not currently support multi-picklist field
                        if (this.sObjectConfig.enforcePicklistValues &&
                            (
                                this.sObjectConfig.enforcePicklistValues === 'RESTRICTED' && field.restrictedPicklist
                                || this.sObjectConfig.enforcePicklistValues === 'ALL'
                            )
                        ) {

                            let picklist = `PicklistConst<typeof ${sobConfig.className}.PICKLIST.${prop.name}>`;
                            if (field.type === SalesforceFieldType.MULTIPICKLIST) {
                                prop.type = `${picklist}[]`;
                            }else {
                                prop.type = picklist;
                            }
                        }
                    }

                }

                props.push(prop);
            } catch (e) {
                throw e;
            }
        });
        return props;
    }

    private mapSObjectType (sfType: string): string {
        switch (sfType) {
            case SalesforceFieldType.DATETIME:
            case SalesforceFieldType.DATE:
                return 'Date';
            case SalesforceFieldType.BOOLEAN:
                return 'boolean';
            case SalesforceFieldType.DOUBLE:
            case SalesforceFieldType.INTEGER:
            case SalesforceFieldType.CURRENCY:
            case SalesforceFieldType.INT:   
            case SalesforceFieldType.PERCENT:
                return 'number';
            case SalesforceFieldType.LOCATION:
                return 'SFLocation';
            case SalesforceFieldType.MULTIPICKLIST:
                return 'string[]';
            case SalesforceFieldType.REFERENCE:
            case SalesforceFieldType.STRING:
            case SalesforceFieldType.PICKLIST:
            case SalesforceFieldType.ID:
            default:
                return 'string';
        }
    }

    private mapTypeToEnum (sfType: string): string {
        return `SalesforceFieldType.${sfType.toUpperCase()}`;
    }

    private getDecorator (field: Field): DecoratorStructure {
        let decoratorProps = {
            apiName: field.name,
            createable: field.createable,
            updateable: field.updateable,
            required: (field.createable || field.updateable) && field.nillable === false,
            externalId: field.externalId,
            childRelationship: false,
            reference: null,
            salesforceLabel: field.label,
            salesforceType: field.type
        };

        return this.generateDecorator(decoratorProps);
    }

    private generateDecorator (decoratorProps: SalesforceDecoratorProps): DecoratorStructure {
        let ref = decoratorProps.reference != null ? `()=>{return ${decoratorProps.reference}}` : 'undefined';
        let sfType = decoratorProps.salesforceType ? `${this.mapTypeToEnum(decoratorProps.salesforceType)}` : 'undefined';
        let label = decoratorProps.salesforceLabel ? decoratorProps.salesforceLabel.replace(/'/g, "\\'") : '';

        let props: {
            [P in keyof Pick<SFieldProperties, Exclude<keyof SFieldProperties, 'toString'>>]: string;
        } = {
            apiName: `'${decoratorProps.apiName}'`,
            createable: `${decoratorProps.createable}`,
            updateable: `${decoratorProps.updateable}`,
            required: `${decoratorProps.required}`,
            reference: `${ref}`,
            childRelationship: `${decoratorProps.childRelationship}`,
            salesforceType: `${sfType}`,
            salesforceLabel: `'${label}'`,
            externalId: `${decoratorProps.externalId}`
        };

        let propsString = Object.keys(props).map(key => {
            return `${key}: ${props[key]}`;
        }).join(', ');

        return {
            kind: StructureKind.Decorator,
            name: `sField`,
            arguments: [
                `{${propsString}}`
            ]
        };
    }

}
