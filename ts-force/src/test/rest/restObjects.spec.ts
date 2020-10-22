// // tslint:disable:no-unused-expression
import 'mocha';

import { expect } from 'chai';

import { CompositeCollection, OAuth, Rest, setDefaultConfig, SObject, UsernamePasswordConfig, compositeRetrieve } from '../..';
import { Account, Contact, User } from '../assets/sobs';
import { getCalendarDate } from '../../utils/calendarDate';

describe('Generated Classes', () => {
  before(async () => {
    const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
    let oAuth = new OAuth(passwordConfig);
    setDefaultConfig(await oAuth.initialize());
  });

  it('Parent Relationship', async () => {
    let acc = new Account({
      name: 'test account',
      website: 'example.com'
    });

    await acc.insert();
    expect(acc.id).to.not.be.null;

    let contact = new Contact({
      accountId: acc.id,
      firstName: `test`,
      lastName: `contact`
    });
    await contact.insert();

    let contact2 = (await Contact.retrieve(`SELECT ${Contact.FIELDS.name}, ${Contact.FIELDS.account}.${Account.FIELDS.website} FROM ${Contact.API_NAME} WHERE Id = '${contact.id}'`))[0];

    expect(contact2.account).not.to.be.empty;
    expect(contact2.account.website).to.equal(acc.website);

    let acc2 = (await Account.retrieve(f => ({
      select: f.parent('parent').select('id', 'accountNumber'),
      where: [{ field: 'id', val: acc.id }]
    })))[0];
    // if the lookup rel isn't set it should be null
    expect(acc2.parent).to.be.null;

    await acc.delete();
  });

  it('DML End-to-End', async () => {
    let acc = new Account({
      name: 'test account'
    });
    await acc.insert();
    expect(acc.id).to.not.be.null;

    acc.name = 'test name 2';
    await acc.update();

    let acc2 = (await Account.retrieve(`SELECT Name FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc2.name).to.equal(acc.name);

    await acc.delete();

    let accounts = await Account.retrieve(`SELECT Name FROM Account WHERE Id = '${acc.id}'`);
    expect(accounts.length).to.equal(0);
  });

  it('Stale Memory', async () => {

    let acc = new Account({
      name: 'stale name'
    });
    await acc.insert();
    expect(acc.id).to.not.be.null;

    let acc2 = (await Account.retrieve(`SELECT Id, Name, Website FROM Account WHERE Id = '${acc.id}'`))[0];
    expect(acc2.name).to.equal('stale name');
    let sobDto = acc2.toJson({ dmlMode: 'update_modified_only' });
    expect(sobDto['Website']).to.equal(undefined);

    acc2.name = 'new name';
    await acc2.update();

    // should not update in memory values which haven't been explicitly set!
    acc.website = 'example.com';
    await acc.update();

    let acc3 = (await Account.retrieve(`SELECT Name, Website FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc3.website).to.equal(acc.website);
    expect(acc3.name).to.equal(acc2.name);

    // test update
    let acc4 = new Account({
      name: 'new name 2',
      id: acc.id
    });

    await acc4.update();
    let acc5 = (await Account.retrieve(`SELECT Name, Website FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc5.name).to.equal(acc4.name);

    // Test preserve object
    expect(acc4._modified.size).to.equal(0, 'expected _modified to be cleared after update');
    acc4.name = 'new name';
    let acc6 = new Account(acc4);
    expect(acc6._modified.size).to.equal(1, '_modified should be preserved when cloning');

    await acc.delete();
  });

  it('prepareFor Update all', async () => {

    let acc = new Account({
      name: 'account'
    });
    await acc.insert();

    let acc2 = (await Account.retrieve(`SELECT Id, Name, CreatedDate FROM Account WHERE Id = '${acc.id}'`))[0];

    let sob = acc2.toJson({ dmlMode: 'update' });

    expect(sob['CreatedDate']).to.equal(undefined);
    expect(sob['Name']).to.equal(acc2.name);

    await acc.delete();
  });

  it('multi-picklists', async () => {

    const { multiPick } = Account.PICKLIST;

    let acc = new Account({
      name: 'account',
      multiPick: [multiPick.ONE, 'two']
    });
    await acc.insert();

    let acc2 = (await Account.retrieve(`SELECT Id, MultiPick__c, CreatedDate FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc2.multiPick.length).to.equal(2);
    expect(acc2.multiPick.indexOf(multiPick.ONE)).to.be.greaterThan(-1);
    expect(acc2.multiPick.indexOf(multiPick.TWO)).to.be.greaterThan(-1);

    let sob = acc2.toJson({ dmlMode: 'all', sendChildObj: true, sendParentObj: true, hideAttributes: true });

    expect(sob.MultiPick__c).to.equal(`${multiPick.ONE};${multiPick.TWO}`);

    await acc.delete();
  });

  it('refresh', async () => {

    let acc = new Account({
      name: 'test account',
      website: 'www.facepamplet.com'
    });
    await acc.insert();
    let acc2 = (await Account.retrieve(`SELECT Id, Name FROM Account WHERE Id = '${acc.id}'`))[0];
    acc2.name = 'test name 2';
    acc2.billingCity = '23';
    await acc2.update({ refresh: true });

    expect(acc2.website).to.equal(acc.website);

    await acc.delete();
  });

  it('query readonly fields', async () => {
    let acc = new Account({ name: 'testing' });
    await acc.insert();

    let acc2 = (await Account.retrieve(fields => {
      return {
        select: fields.select('lastModifiedDate', 'createdById'),
        where: [
          { field: fields.select('id'), op: '=', val: acc.id }
        ]
      };
    }))[0];

    expect(acc2.lastModifiedDate).not.null;
    expect(acc2.createdById).not.null;
  });

  it('Collections End-to-End', async () => {
    let acc = new Account({
      name: 'test account'
    });
    await acc.insert();

    let contacts = [];
    const contactSize = 50;
    for (let i = 0; i < contactSize; i++) {
      contacts.push(new Contact({
        accountId: acc.id,
        firstName: `test`,
        lastName: `contact ${i}`
      }));
    }

    let bulk = new CompositeCollection();
    let insertResults = await bulk.insert(contacts);
    expect(contacts[0]._modified.size).to.equal(0);

    insertResults.forEach(r => {
      if (!r.success) {
        throw r.errors.map(e => e.message).join(', ');
      }
    });

    acc = (await Account.retrieve(`SELECT Id, (SELECT ${Contact.FIELDS.name.apiName} FROM ${Account.FIELDS.contacts.apiName}) FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc.contacts.length).to.equal(contactSize);

    contacts.forEach(c => {
      c.email = 'test@example.com';
    });

    let updateResults = await bulk.update(contacts);
    expect(contacts[0]._modified.size).to.equal(0);
    updateResults.forEach(r => {
      if (!r.success) {
        throw r.errors.map(e => e.message).join(', ');
      }
    });

    acc = (await Account.retrieve(`SELECT Id, (SELECT ${Contact.FIELDS.name.apiName}, ${Contact.FIELDS.email} FROM ${Account.FIELDS.contacts.apiName}) FROM Account WHERE Id = '${acc.id}'`))[0];
    acc.contacts.forEach(c => {
      expect(c.email).to.equal('test@example.com');
    });

    let delResults = await bulk.delete(contacts);
    delResults.forEach(r => {
      if (!r.success) {
        throw r.errors.map(e => e.message).join(', ');
      }
    });

    acc = (await Account.retrieve(`SELECT Id, (SELECT ${Contact.FIELDS.name.apiName} FROM ${Account.FIELDS.contacts.apiName}) FROM Account WHERE Id = '${acc.id}'`))[0];

    expect(acc.contacts.length).to.equal(0);

    await acc.delete();
  });

  it('should set relation by external id', async () => {
    const extId = '123abcd';
    // setup account
    let accs = await Account.retrieve(f => {
      return {
        select: [
          ...f.select('id', 'testExternalId')
        ],
        where: [
          { field: f.select('testExternalId'), op: '=', val: extId }
        ]
      };
    });

    let acc: Account;
    if (accs.length) {
      acc = accs[0];
    } else {
      acc = new Account({
        name: 'test external id account',
        testExternalId: extId
      });
      await acc.insert();
    }

    let contact = new Contact({
      firstName: 'john',
      lastName: 'doe',
      account: new Account({ testExternalId: extId })
    });

    await contact.insert();

    let retCont = await Contact.retrieve(f => {
      return {
        select: [
          f.select('accountId')
        ],
        where: [
          { field: f.select('id'), op: '=', val: contact.id }
        ]
      };
    });

    expect(retCont[0].accountId).to.equal(acc.id);

  });

  it('prepareFor Apex', async () => {

    let c = new Contact({
      id: '123',
      accountId: 'abc',
      firstName: `john`,
      lastName: `doe`,
      account: new Account({
        name: 'acme'
      })
    });

    expect(c.toJson({ dmlMode: 'all', sendChildObj: true, sendParentObj: true, hideAttributes: true })).to.deep.equal(
      {
        Id: '123',
        AccountId: 'abc',
        FirstName: 'john',
        LastName: 'doe',
        Account: {
          Name: 'acme'
        }
      }
    );

    let acc = new Account({
      id: '123',
      contacts: [new Contact({
        firstName: 'john',
        lastName: 'doe'
      })]
    });

    expect(acc.toJson({ dmlMode: 'all', sendChildObj: true, sendParentObj: true, hideAttributes: true })).to.deep.equal(
      {
        Id: '123',
        Contacts: { records: [{ FirstName: 'john', LastName: 'doe' }] }
      }
    );
  });

  it('prepareFor Apex End To End', async () => {
    let acc = new Account({
      id: '123',
      contacts: [new Contact({
        firstName: 'john',
        lastName: 'doe'
      })],
      owner: new User({
        'email': 'example@gmai.com'
      })
    });

    const sfSob = acc.toJson({ dmlMode: 'all', sendChildObj: true, sendParentObj: true, hideAttributes: true });
    let data = (await new Rest().request.post<SObject>(
      '/services/apexrest/myservice',
      { acc: sfSob }
    )).data;
    const retAcc = Account.fromSFObject(data);
    expect(acc.id).to.deep.equal(retAcc.id);
    expect(acc.contacts[0].firstName).to.deep.equal(retAcc.contacts[0].firstName);
    expect(acc.contacts[0].lastName).to.deep.equal(retAcc.contacts[0].lastName);
    expect(acc.owner.email).to.deep.equal(retAcc.owner.email);
  });

  it('composite retrieve', async () => {
    let results = await compositeRetrieve(Contact, Account, User)(
      f => ({ select: f.select('cleanStatus', 'email', 'accountId') }),
      f => ({ select: f.select('numberOfEmployees', 'accountNumber', 'active') }),
      'select x from blah'
    );
    let contactResults = results[0];
    if (Array.isArray(contactResults)) {
      expect(contactResults.length).to.be.greaterThan(0);
      expect(contactResults[0] instanceof Contact).to.be.eq(true);
    } else {
      throw new Error('Expected results[0] to return Contact[]');
    }

    let accountResults = results[1];
    if (Array.isArray(accountResults)) {
      expect(accountResults.length).to.be.greaterThan(0);
      expect(accountResults[0] instanceof Account).to.be.eq(true);
    } else {
      throw new Error('Expected results[1] to return Account[]');
    }

    let userResults = results[2];
    if (!Array.isArray(userResults)) {
      expect(userResults.statusCode).to.be.eq(400);
      expect(Array.isArray(userResults.result)).to.be.eq(true);
    } else {
      throw new Error('Expected results[2] to return errors');
    }
  });

  it('DML Date Consistency', async () => {
    let c = new Contact({
      firstName: 'test',
      lastName: 'contact',
      birthdate: getCalendarDate()
    });
    await c.insert();
    expect(c.id).to.not.be.null;

    let c2 = (await Contact.retrieve(f => ({
      select: [f.select('birthdate')],
      where: [{ field: 'id', val: c.id }]
    })))[0];

    expect(c2.birthdate).to.deep.equal(c.birthdate);

    await c.delete();
  });

});
