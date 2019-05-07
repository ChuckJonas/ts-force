// // tslint:disable:no-unused-expression
import 'mocha';
import { expect } from 'chai';

import { OAuth, Rest, setDefaultConfig, UsernamePasswordConfig } from '../..';

describe('Rest Client', () => {
    before(async () => {
        const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
        let oAuth = new OAuth(passwordConfig);
        setDefaultConfig(await oAuth.initialize());
    });

    it('construction', async () => {
        let client1 = new Rest();
        let client2 = new Rest();
        
        let clientOther = new Rest({
            accessToken: 'abc',
            'instanceUrl': '123'
        });

        expect(client1).to.equal(client2);
        expect(client1).not.to.equal(clientOther);
    });

});
