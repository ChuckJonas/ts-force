import { should } from 'chai';
import 'mocha';
import { requestAccessToken } from '../../auth/oAuth2';
// set up should
should();

describe('OAuth Test', () => {
    it('should load params form ENV', async () => {

        const resp = await requestAccessToken({
          instanceUrl: process.env.HOST,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
          grant_type: 'password'
        });

        resp.access_token.should.not.be.null;
        resp.instance_url.should.not.be.null;
    });
});
