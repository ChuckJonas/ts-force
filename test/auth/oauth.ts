import { suite, test, slow, timeout } from 'mocha-typescript'
import { should, assert } from 'chai'
import * as nock from 'nock'
import { OAuth } from '../../src/auth/oauth'
// set up should
should()

@suite class OAuthTest extends OAuth {
  @test 'does this work' () {
    console.log(this)
  }
}
