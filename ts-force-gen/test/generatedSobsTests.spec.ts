// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { cleanAPIName } from '../src/util';

@suite class TestGenerator {

    @test async 'Sanitize Names' () {
        expect(cleanAPIName('My_Test_Object__c')).to.equal('MyTestObject');
        expect(cleanAPIName('My_Test_Relation__r')).to.equal('MyTestRelation');
        expect(cleanAPIName('My__Test_Object__r')).to.equal('MyTestObject');
    }
}
