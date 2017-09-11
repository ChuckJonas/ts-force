import { Scope, SourceFile, PropertyDeclarationStructure, DecoratorStructure, JSDocStructure } from "ts-simple-ast";
import { Rest } from "../main/lib/rest";
import { Field, SObjectDescribe, ChildRelationship } from "../main/lib/SObjectDescribe";
import { SFieldProperties } from '../main/lib/sObjectDecorators';
const superClass = 'RestObject';

export class SObjectGenerator {

    public apiNames: string[];
    public sourceFile: SourceFile;

    constructor(sourceFile: SourceFile, apiNames: string[]) {
        this.apiNames = apiNames;
        this.sourceFile = sourceFile;
    }

    public async generateFile() {
        //add imports
        this.sourceFile.addImport({
            moduleSpecifier: 'ts-force',
            namedImports: [
                { name: 'RestObject' },
                { name: 'SObject' },
                { name: 'sField' }
            ]
        });

        for (var i = 0; i < this.apiNames.length; i++) {
            await this.generateSObjectClass(this.apiNames[i]);
        }

    }

    //class generation
    public async generateSObjectClass(apiName: string): Promise<void> {

        let sobDescribe = await this.retrieveDescribe(apiName);

        let members = sobDescribe.fields;
        let children = sobDescribe.childRelationships;

        let className: string = this.sanatizeClassName(apiName);

        let props: PropertyDeclarationStructure[] = [];

        //add children relationships
        children.forEach(child => {
            if (this.apiNames.indexOf(child.childSObject) > -1 && child.childSObject != apiName) {
                let referenceClass = this.sanatizeClassName(child.childSObject);

                let decoratorProps = {
                    apiName: child.relationshipName,
                    readOnly: true,
                    required: false,
                    childRelationship: true,
                    reference: referenceClass
                }

                props.push({
                    name: child.relationshipName,
                    type: `${referenceClass}[]`,
                    scope: Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ]
                });
            }
        });

        //add members
        members.forEach(field => {
            let docs: JSDocStructure[] = [];
            if (field.inlineHelpText != null) {
                docs.push({ description: field.inlineHelpText });
            }

            //only include reference types if we are also generating the referenced class
            if (field.type == 'reference' && this.apiNames.indexOf(field.referenceTo[0]) > -1) {
                let referenceClass: string;

                if (field.referenceTo.length > 1) {
                    referenceClass = 'any'; //polymorphic?
                } else {
                    referenceClass = this.sanatizeClassName(field.referenceTo[0]);
                }
                let refApiName = field.referenceTo[0]; //polymorphic not support

                let decoratorProps = {
                    apiName: field.relationshipName,
                    readOnly: true,
                    required: false,
                    childRelationship: false,
                    reference: referenceClass
                }

                props.push({
                    name: field.relationshipName,
                    type: referenceClass,
                    scope: Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ],
                    docs: docs
                });
            }

            let prop: PropertyDeclarationStructure = {
                name: field.name,
                type: this.mapSObjectType(field.type),
                scope: Scope.Public,
                decorators: [this.getDecorator(field)],
                docs: docs
            }

            props.push(prop);
        });

        const classDeclaration = this.sourceFile.addClass({
            name: className,
            extends: superClass,
            isExported: true,
            properties: props
        });

        const constr = classDeclaration.addConstructor();
        constr.setBodyText(`super('${apiName}');`);

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

    }

    private async retrieveDescribe(apiName: string): Promise<SObjectDescribe> {
        return await Rest.Instance.getSObjectDescribe(apiName);
    }

    private sanatizeClassName(apiName: string): string {
        return apiName.replace('__c', '').replace('_', '');
    }

    private mapSObjectType(sfType: string): string {
        switch (sfType) {
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

    private generateDecorator(decoratorProps: any) {
        var ref = decoratorProps.reference != null ? `()=>{return ${decoratorProps.reference}}`: 'undefined'
        return {
            name: `sField`,
            arguments: [
                `{apiName: '${decoratorProps.apiName}', readOnly: ${decoratorProps.readOnly}, required: ${decoratorProps.required}, reference:${ref}, childRelationship: ${decoratorProps.childRelationship}}`
            ]
        }
    }

    private getDecorator(field: Field): DecoratorStructure {
         let decoratorProps = {
                    apiName: field.name,
                    readOnly: field.updateable == false && field.createable == false,
                    required: (field.createable || field.updateable) && field.nillable == false,
                    childRelationship: false,
                    reference: null
                }

        return this.generateDecorator(decoratorProps)
    }


}