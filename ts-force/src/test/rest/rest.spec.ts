// // tslint:disable:no-unused-expression
import { expect } from 'chai';
import 'mocha';
import { Rest } from '../..';
import { createDefaultClient } from '../helper';


describe('Rest Client', () => {
    before(async () => {
      await createDefaultClient();
    });

    it('should construct', async () => {
        let client1 = new Rest();
        let client2 = new Rest();

        let clientOther = new Rest({
            accessToken: 'abc',
            instanceUrl: '123'
        });

        expect(client1).to.equal(client2);
        expect(client1).not.to.equal(clientOther);
    });

    it('should capture rest limit from header', async () => {
        let client = new Rest();

        await client.query('SELECT Id FROM Account');

        expect(client.apiLimit.limit).to.be.greaterThan(0);
        expect(client.apiLimit.used).to.be.greaterThan(0);
    });

    it('can call limits endpoint', async () => {
        let client = new Rest();

        let limits = await client.limits();

        expect(limits.DailyStreamingApiEvents.Max).to.be.greaterThan(0);

    });

});
