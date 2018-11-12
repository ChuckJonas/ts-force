import 'mocha';
import { expect } from 'chai';
import { buildQuery } from '../..';
import { Account } from '../testAssets/sobs';

describe('SubQueries Tests', () => {
    it('select (select x from y)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [
                    fields.subQuery('contacts',subFields => {
                        return {
                            select: subFields.select('id', 'name')
                        }
                    })
                ]
            }
        })
        expect(qry).to.equal(`SELECT (SELECT Id, Name FROM Contacts) FROM Account`);
    })

    it('select (select x.y, x.z from y)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [
                    fields.subQuery('contacts', subFields => {
                        return {
                            select: subFields.parent('owner').select('phone', 'name')
                        }
                    })
                ]
            }
        });
        expect(qry).to.equal(`SELECT (SELECT Owner.Phone, Owner.Name FROM Contacts) FROM Account`);
    })


    it('select (select x.y, x.z from y where x)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [
                    fields.subQuery('contacts', subFields => {
                        return {
                            select: subFields.parent('owner').select('phone', 'name'),
                            where: [
                                {field: fields.select('phone'), op: '=', val: '828-555-5555'}
                            ]
                        }
                    })
                ]
            }
        });
        expect(qry).to.equal(`SELECT (SELECT Owner.Phone, Owner.Name FROM Contacts WHERE Phone = '828-555-5555') FROM Account`);
    })
});

