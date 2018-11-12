import { should } from 'chai';
import 'mocha';
import { OAuth, UsernamePasswordConfig } from '../../auth/oauth';
import { Rest } from '../../lib/rest';
import { setDefaultConfig } from '../../auth/baseConfig';
// set up should
should();

const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);

describe('env test', () => {
    it('should load params form ENV', () => {
    const req = passwordConfig.reqBody();
    req.client_id.should.eql(process.env.CLIENT_ID);
    req.client_secret.should.eql(process.env.CLIENT_SECRET);
    req.grant_type.should.eql('password');
    req.password.should.eql(process.env.PASSWORD);
    req.username.should.eql(process.env.USERNAME);
  });
});

describe('OAuth Test', () => {
    it('should load params form ENV', async () => {
        let auth = new OAuth(passwordConfig);
        await auth.initialize();
        auth.accessToken.should.not.eql('');
        auth.instanceUrl.should.not.eql('');
    });

    it('Get Token', async () => {
        let auth = new OAuth(passwordConfig);
        await auth.initialize();
        auth.accessToken.should.not.eql('');
        auth.instanceUrl.should.not.eql('');
    });

    it('Valid Passthrough to Rest Configs and Query Call', async () => {
        let auth = new OAuth(passwordConfig);
        setDefaultConfig(await auth.initialize());
        // start a new REST instance to see if proplery filled out
        const rest = new Rest();
        const response = await rest.query('SELECT Id FROM Account');
        // assume we have at least one account to play with
        response.totalSize.should.be.above(0);
    });
});
