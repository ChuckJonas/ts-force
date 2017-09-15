import { suite, test, slow, timeout } from 'mocha-typescript';
import { should, assert } from 'chai';
import * as nock from 'nock';
import { OAuth, UsernamePasswordConfig } from '../../src/auth/oauth';
import { Rest } from '../../src/main/lib/rest';
// set up should
should();

const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
@suite class PasswordConfigTest {
  @test 'Should render Data for Request' () {
    const req = passwordConfig.reqBody();
    req.client_id.should.eql(process.env.CLIENT_ID);
    req.client_secret.should.eql(process.env.CLIENT_SECRET);
    req.grant_type.should.eql('password');
    req.password.should.eql(process.env.PASSWORD);
    req.username.should.eql(process.env.USERNAME);
  }
}
@suite class OAuthTest extends OAuth {
  constructor () {
    super(passwordConfig);
  }
  @test async 'Get Token' () {
    await this.initialize();
    this.accessToken.should.not.eql('');
    this.instanceUrl.should.not.eql('');
  }
  @test async 'Valid Passthrough to Rest Configs and Query Call' () {
    Rest.config = await this.initialize();
    // start a new REST instance to see if proplery filled out
    const rest = new Rest();
    const response = await rest.query('SELECT id FROM Account');
    // assume we have at least one account to play with
    response.totalSize.should.be.above(0);
  }
}
