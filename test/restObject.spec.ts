import { suite, test, slow, timeout } from 'mocha-typescript'
import { should, assert } from 'chai'
import * as nock from 'nock';
import { RestObject, BaseConfig, Rest } from '../src/index'
import { Account } from './lib/generatedSobs'
import { getSFieldProps, SFieldProperties } from '../src/main/lib/sObjectDecorators';
// set up should
should()

// set up nock
const mockSfQueryResult = {
  "done": true,
  "records": [
    {
      "Contacts": {
        "done": true,
        "records": [
          {
            "Id": "0030m000007dOaiAAE",
            "Name": "Jack Rogers",
            "attributes": {
              "type": "Contact",
              "url": "/services/data/v40.0/sobjects/Contact/0030m000007dOaiAAE"
            }
          }
        ],
        "totalSize": 1
      },
      "Id": "0010m000006wIAPAA2",
      "Name": "Burlington Textiles Corp of America",
      "Parent": {
        "Id": "0010m000006wIARAA2",
        "Name": "Dickenson plc",
        "attributes": {
          "type": "Account",
          "url": "/services/data/v40.0/sobjects/Account/0010m000006wIARAA2"
        }
      },
      "attributes": {
        "type": "Account",
        "url": "/services/data/v40.0/sobjects/Account/0010m000006wIAPAA2"
      }
    }
  ],
  "totalSize": 1
}

const mockHost = 'http://salesforceissocoolguys.com'
const nockObj = nock(mockHost).get(/query/).reply(200, mockSfQueryResult)
// set up hosting
const config = new BaseConfig()
config.accessToken = '123abc'
config.host = mockHost
Rest.config = config

@suite class GeneratedObjectTest{

  @test async 'Retrieved Objects Should have DML methods'() {
    const response = await Account.retrieve(`SELECT Id, Name, Parent.Id, Parent.Name, (SELECT Id, Name FROM Contacts) FROM Account WHERE Id = '0010m000006wIAP'`);
    response.should.have.length(1)
    const acc = response[0];
    assert.isFunction(acc.update, 'Primary Object Should have DML functions!');
    assert.isFunction(acc.insert, 'Primary Object Should have DML functions!');
    assert.isFunction(acc.delete, 'Primary Object Should have DML functions!');

    const parentAcc = acc.parent;
    assert.isFunction(parentAcc.update, 'ParentObjects Should have DML functions!');
    assert.isFunction(parentAcc.insert, 'ParentObjects Should have DML functions!');
    assert.isFunction(parentAcc.delete, 'ParentObjects Should have DML functions!');

    acc.contacts.forEach(contact => {
      assert.isFunction(contact.update, 'Child Objects Should have DML functions!');
      assert.isFunction(contact.insert, 'Child Objects Should have DML functions!');
      assert.isFunction(contact.delete, 'Child Objects Should have DML functions!');
    })
  }

}

@suite class RestObjectTest extends Account{

  @test async 'Readonly & Relationships should be removed'() {
    this.accountNumber = 'abc';
    let parent = new Account();
    parent.name = 'abc';
    this.parent = parent
    this.isDeleted = true;

    let data: Account = this.prepareForDML();

    let accountNumberMeta = getSFieldProps(this, 'accountNumber');
    let parentMeta = getSFieldProps(this, 'parent');
    let isDeletedMeta = getSFieldProps(this, 'isDeleted');
    assert(data[accountNumberMeta.apiName] == this.accountNumber, 'Updatable Property should be mapped to data');
    assert(data[parentMeta.apiName] == undefined, 'relational propery should not be copied');
    assert(data[isDeletedMeta.apiName] == undefined, 'readonly');

  }

}