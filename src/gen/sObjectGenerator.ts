import { Scope, SourceFile, PropertyDeclarationStructure, DecoratorStructure, JSDocStructure } from "ts-simple-ast";
import { Rest } from "../main/lib/rest";
import { Field, SObjectDescribe, ChildRelationship } from "../main/lib/SObjectDescribe";

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
        { name: 'reference' },
        { name: 'required' },
        { name: 'readonly' },
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

        props.push({
          name: child.relationshipName,
          type: `${referenceClass}[]`,
          scope: Scope.Public
          //TODO add decorator for child relationship
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

        props.push({
          name: field.relationshipName,
          type: referenceClass,
          scope: Scope.Public,
          decorators: [{
            name: `reference(${referenceClass})`
          }],
          docs: docs
        });
      }

      let prop: PropertyDeclarationStructure = {
        name: field.name,
        type: this.mapSObjectType(field.type),
        scope: Scope.Public,
        decorators: this.getDecorators(field),
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

  private getDecorators(field: Field): DecoratorStructure[] {
    let decorators: DecoratorStructure[] = [];
    if (field.updateable == false && field.createable == false) {
      decorators.push({
        name: 'readonly()'
      });
    }
    // else if(field.updateable == false && field.createable == true){
    //   decorators.push({
    //     name:'CreateOnly'
    //   })
    // }else if(field.updateable == true && field.createable == false){
    //   decorators.push({
    //     name:'UpdateOnly'
    //   })
    // }

    //this should maybe be managed by making prop required... although that makes querying inconvient
    if ((field.createable || field.updateable) && field.nillable == false) {
      decorators.push({
        name: 'required()'
      });
    }

    return decorators;
  }


}