// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { cleanAPIName } from '../src/util';

@suite class TestGenerator {

  @test async 'Sanitize Names' () {
    expect(cleanAPIName('My_Test_Object__c', true)).to.equal('MyTestObject');
    expect(cleanAPIName('My_Test_Relation__r', false)).to.equal('MyTestRelation');
    expect(cleanAPIName('NS__Test_Object__r', true)).to.equal('TestObject');
    expect(cleanAPIName('NS__Test_Object__r', false)).to.equal('NSTestObject');
  }
}
