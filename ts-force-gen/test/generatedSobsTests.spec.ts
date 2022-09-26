// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { cleanAPIName } from '../src/util';

describe('Test Generator', () => {
  it('Sanitize Names', () => {
    expect(cleanAPIName('My_Test_Object__c', false)).to.equal('MyTestObject');
    expect(cleanAPIName('My_Test_Relation__r', true)).to.equal('MyTestRelation');
    expect(cleanAPIName('NS__Test_Object__r', false)).to.equal('TestObject');
    expect(cleanAPIName('NS__Test_Object__r', true)).to.equal('NSTestObject');
    expect(cleanAPIName('NS__Test_object__r', true)).to.equal('NSTestObject');
    expect(cleanAPIName('NS__Test_object__r', true)).to.equal('NSTestObject');
    expect(cleanAPIName('My_Test_Object__pc', false)).to.equal('MyTestObjectPC');
  })
})
