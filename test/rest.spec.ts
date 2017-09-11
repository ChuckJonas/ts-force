import { suite, test, slow, timeout } from 'mocha-typescript'
import { should } from 'chai'
import * as nock from 'nock'
import { Rest, BaseConfig, SObject } from '../src/index'
// set up should
should()

// new mock SObject for fun
class MockSObj extends SObject{
  public name: string
  constructor () {
    super('MockSObj')
  }
}
// set up nock
const mockSfQueryResult = {
  'done' : true,
  'totalSize' : 2,
  'records' :
  [
    {
      'attributes' :
      {
        'type' : 'MockSObj',
        'url' : '/services/data/v20.0/sobjects/MockSObj/001D000000IRFmaIAH'
      },
      'Name' : 'Test 1'
    },
    {
      'attributes' :
      {
        'type' : 'MockSObj',
        'url' : '/services/data/v20.0/sobjects/MockSObj/001D000000IomazIAB'
      },
      'Name' : 'Test 2'
    }]
}
const mockHost = 'http://salesforceissocoolguys.com'
const nockObj = nock(mockHost).get(/query/).reply(200, mockSfQueryResult)
// set up hosting
const config = new BaseConfig()
config.accessToken = '123abc'
config.host = mockHost
Rest.config = config

// fire off test
@suite class RestTest extends Rest {

  @test 'Should Have Vaules in the base config' () {
    Rest.config.accessToken.should.eql('123abc')
  }
  @test async 'Should Allow for a query' () {

    const response = await Rest.Instance.query('Select id from MockSObj')
    response.totalSize.should.be.above(0)
    response.records.should.be.an('array')
  }
}
