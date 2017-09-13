import { Scope, SourceFile,
  PropertyDeclarationStructure,
  DecoratorStructure, JSDocStructure, ClassDeclaration } from "ts-simple-ast";
  import { Rest, RestObject } from "../index"
  import { Field, SObjectDescribe, ChildRelationship } from "../main/lib/SObjectDescribe";
import { SFieldProperties } from '../main/lib/sObjectDecorators';

const superClass = 'RestObject';

export class SObjectGenerator {

    public apiNames: string[]
    public sourceFile: SourceFile

    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} apiNames: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor(sourceFile: SourceFile, apiNames: string[]) {
      this.apiNames = apiNames
      this.sourceFile = sourceFile
    }

    public async generateFile () {
      // add imports
      this.sourceFile.addImport({
        moduleSpecifier: 'ts-force',
        namedImports: [
          { name: 'RestObject' },
          { name: 'SObject' },
          { name: 'sField' }
        ]
      })

      for (let i = 0; i < this.apiNames.length; i++) {
        await this.generateSObjectClass(this.apiNames[i])
      }

    }

    // class generation
    public async generateSObjectClass (apiName: string): Promise<void> {

      let sobDescribe = await this.retrieveDescribe(apiName)

      let props: PropertyDeclarationStructure[] = []

      // generate props from fields & children
      props.push(...this.generateChildrenProps(apiName, sobDescribe.childRelationships))
      props.push(...this.generateFieldProps(sobDescribe.fields))

      let className = this.sanatizeClassName(apiName)

      let classDeclaration = this.generateClass(apiName, className, props)

      const qryMethod = classDeclaration.addMethod({
        name: 'retrieve',
        isStatic: true,
        scope: Scope.Public,
        parameters: [
          { name: 'qry', type: 'string' }
        ],
        returnType: `Promise<${className}[]>`,
        isAsync: true
      })

      qryMethod.setBodyText(
        `return await ${superClass}.query<${className}>(${className}, qry);`
      )

    }

    private generateClass (apiName: string, className: string, props: PropertyDeclarationStructure[]): ClassDeclaration {
      let classDeclaration = this.sourceFile.addClass({
        name: className,
        extends: superClass,
        isExported: true,
        properties: props,
        docs: [{description: `Generated class for ${apiName}` }]
      })

      const constr = classDeclaration.addConstructor()

      const propsInit = props.map(prop => {
        return `this.${prop.name} = void 0;`
      }).join('\n')

      constr.setBodyText(`super('${apiName}');
      ${propsInit}`)

      return classDeclaration
    }

  private async retrieveDescribe (apiName: string): Promise<SObjectDescribe> {
      return await Rest.Instance.getSObjectDescribe(apiName)
    }

  private sanatizeClassName (apiName: string): string {
    return apiName.replace('__c', '').replace('_', '')
  }

  private generateChildrenProps (apiName: string, children: ChildRelationship[]): PropertyDeclarationStructure[] {
    let props = []
    children.forEach(child => {

        // don't generate if not in the list of types or ??
      if (this.apiNames.indexOf(child.childSObject) === -1 || child.childSObject === apiName) {
        return
      }

      let referenceClass = this.sanatizeClassName(child.childSObject)

      let decoratorProps = {
        apiName: child.relationshipName,
        readOnly: true,
        required: false,
        childRelationship: true,
        reference: referenceClass
      }

      props.push({
        name: RestObject.sanatizeProperty(child.relationshipName),
        type: `${referenceClass}[]`,
        scope: Scope.Public,
        decorators: [
          this.generateDecorator(decoratorProps)
        ]
      })
    })
    return props
  }

  private generateFieldProps (fields: Field[]): PropertyDeclarationStructure[] {
    let props = []
      // add members
    fields.forEach(field => {
      let docs: JSDocStructure[] = []
      if (field.inlineHelpText != null) {
        docs.push({ description: field.inlineHelpText })
      }

        // only include reference types if we are also generating the referenced class
      if (field.type === 'reference' && this.apiNames.indexOf(field.referenceTo[0]) > -1) {
        let referenceClass: string

        if (field.referenceTo.length > 1) {
          referenceClass = 'any' // polymorphic?
        } else {
          referenceClass = this.sanatizeClassName(field.referenceTo[0])
        }
        let refApiName = field.referenceTo[0] // polymorphic not support

        let decoratorProps = {
          apiName: field.relationshipName,
          readOnly: true,
          required: false,
          childRelationship: false,
          reference: referenceClass
        }

        props.push({
          name: RestObject.sanatizeProperty(field.relationshipName),
          type: referenceClass,
          scope: Scope.Public,
          decorators: [
            this.generateDecorator(decoratorProps)
          ],
          docs: docs
        })
      }

      let prop: PropertyDeclarationStructure = {
        name: RestObject.sanatizeProperty(field.name),
        type: this.mapSObjectType(field.type),
        scope: Scope.Public,
        decorators: [this.getDecorator(field)],
        docs: docs
      }

      props.push(prop)
    })
    return props
  }

  private mapSObjectType (sfType: string): string {
    switch (sfType) {
      case 'datetime':
      case 'date':
        return 'Date'
      case 'boolean':
        return 'boolean'
      case 'double':
      case 'integer':
      case 'currency':
        return 'number'
      case 'reference':
      case 'string':
      case 'picklist':
      case 'id':
      default:
        return 'string'
    }
  }

  private getDecorator (field: Field): DecoratorStructure {
    let decoratorProps = {
      apiName: field.name,
      readOnly: field.updateable === false && field.createable === false,
      required: (field.createable || field.updateable) && field.nillable === false,
      childRelationship: false,
      reference: null
    }

    return this.generateDecorator(decoratorProps)
  }

  private generateDecorator (decoratorProps: any) {
    let ref = decoratorProps.reference != null ? `()=>{return ${decoratorProps.reference}}` : 'undefined'
    return {
      name: `sField`,
      arguments: [
        `{apiName: '${decoratorProps.apiName}', readOnly: ${decoratorProps.readOnly}, required: ${decoratorProps.required}, reference:${ref}, childRelationship: ${decoratorProps.childRelationship}}`
      ]
    }
  }

}
