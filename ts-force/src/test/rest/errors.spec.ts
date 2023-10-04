// // tslint:disable:no-unused-expression
import { AxiosError } from 'axios';
import { expect } from 'chai';
import 'mocha';
import { getStandardError, Rest, SObject } from '../..';
import { Account, Contact } from '../assets/sobs';
import { createDefaultClient } from '../helper';



describe('Error Handlers', () => {
    before(async () => {
        await createDefaultClient();
    });

    it('404', async () => {
        try {

            let data = (await new Rest().request.post<SObject>(
                '/services/apexrest/asdf'
            )).data;
            throw new Error('Exception Expected');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            let axiosE = stdErr.e as AxiosError;
            expect(axiosE.response.status).to.equal(404);
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('NOT_FOUND');
            expect(stdErr.errorDetails[0].message).to.contain('Could not find a match for URL');

        }
    });

    it('bad request', async () => {
        try {
            let data = (await new Rest().request.post<SObject>(
                '/services/apexrest/myservice',
                { acc: { asdf: 'not valid' } }
            )).data;
            throw new Error('Exception Expected');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('JSON_PARSER_ERROR');
            expect(stdErr.errorDetails[0].message).to.contain('No such column');
        }
    });

    it('invalid SOQL field', async () => {
        try {
            await Account.retrieve('SELECT asdf FROM ACCOUNT');
            throw new Error('Exception Expected');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('INVALID_FIELD');
            expect(stdErr.errorDetails[0].message).to.contain('SELECT asdf FROM ACCOUNT');
        }
    });

    it('bad SOQL', async () => {
        try {
            await Account.retrieve('asdafagw');
            throw new Error('Exception Expected');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('MALFORMED_QUERY');
            expect(stdErr.errorDetails[0].message).to.contain('unexpected token');
        }
    });

    it('insert required field missing', async () => {
        try {
            let contact = await new Contact({}).insert();
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('REQUIRED_FIELD_MISSING');
            expect(stdErr.errorDetails[0].message).to.contain('Required fields are missing: [LastName]');
        }
    });

    it('no id set', async () => {
        try {
            await new Account({name: 'tsterr'}).update();
            throw new Error('update should have failed!');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('any');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal(undefined);
            expect(stdErr.errorDetails[0].message).to.contain('Must have Id to update');
        }
    });

    it('update invalid id field', async () => {
        let acc = await new Account({name: 'tsterr'}).insert();
        try {
            acc.ownerId = '12341';
            await acc.update();
            throw new Error('update should have failed!');
        } catch (e: any) {
            let stdErr = getStandardError(e);
            expect(stdErr.type).to.equal('axios');
            expect(stdErr.errorDetails.length).to.equal(1);
            expect(stdErr.errorDetails[0].errorCode).to.equal('MALFORMED_ID');
            expect(stdErr.errorDetails[0].message).to.contain('Owner ID: id value of incorrect type');
            acc.delete();
        }
    });

});
