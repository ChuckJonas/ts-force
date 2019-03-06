import { buildQuery } from '../..';
import { expect } from 'chai';
import { Account, Contact } from '../assets/sobs';
import 'mocha';

describe('Select Tests', () => {

  it('select x', () => {
    let qry = buildQuery(Account, fields => {
        return {
            select: [
                fields.select('accountNumber')
            ]
        };
    });
    expect(qry).to.equal('SELECT AccountNumber FROM Account');
  });

  it('select x, y', () => {
    let qry = buildQuery(Account, fields => {
        return {
            select: fields.select('accountNumber', 'active', 'website')
        };
    });
    expect(qry).to.equal('SELECT AccountNumber, Active__c, Website FROM Account');
  });

  it('select x with arr arg', () => {
    let qry = buildQuery(Account, fields => {
        return {
            select: fields.select(['accountNumber'])
        };
    });
    expect(qry).to.equal('SELECT AccountNumber FROM Account');
  });

  it('select x, y with arr arg', () => {
    let qry = buildQuery(Account, fields => {
        return {
            select: fields.select(['accountNumber', 'active', 'website'])
        };
    });
    expect(qry).to.equal('SELECT AccountNumber, Active__c, Website FROM Account');
  });

  it('select x.y', () => {
    let qry = buildQuery(Contact, fields => {
        return {
            select: [
                fields.parent('account').select('accountNumber')
            ]
        };
    });
    expect(qry).to.equal('SELECT Account.AccountNumber FROM Contact');
  });

  it('select x.y.z', () => {
    let qry = buildQuery(Contact, fields => {
        return {
            select: [
                fields.parent('account').parent('owner').select('name' )
            ]
        };
    });

    expect(qry).to.equal('SELECT Account.Owner.Name FROM Contact');
  });

  it('select x.y, x.z', () => {
    let qry = buildQuery(Contact, fields => {
        return {
            select: fields.parent('account').select('accountNumber', 'active')
        };
    });
    expect(qry).to.equal('SELECT Account.AccountNumber, Account.Active__c FROM Contact');
  });

  it('select x, y, z.a, z.b', () => {

    let qry = buildQuery(Contact, fields => {
        let x = fields.select('assistantName',{field: 'createdById', fn: 'AVG'}, 'accountId', {field: 'assistantPhone', fn: 'CALENDAR_MONTH'});
        return {
            select: [
                ...fields.select('accountId', 'email'),
                ...fields.parent('account').select('accountNumber', 'active')
            ]
        };
    });
    expect(qry).to.equal('SELECT AccountId, Email, Account.AccountNumber, Account.Active__c FROM Contact');
  });

  it('select COUNT(x) c', () => {
    let qry = buildQuery(Account, fields => {
        return {
            select: [
                fields.select({fn: 'COUNT',field: 'accountNumber', alias: 'c'})
            ]
        };
    });
    expect(qry).to.equal('SELECT COUNT(AccountNumber) c FROM Account');
  });
});
