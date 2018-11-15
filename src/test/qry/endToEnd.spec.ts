import { buildQuery } from '../..';
import { expect } from 'chai';
import { Account } from '../assets/sobs';
import 'mocha';

describe('Select Tests', () => {
    it('do it all', () => {

        let qry = buildQuery(Account, fields => {
            return {
                select: [
                    fields.select('name'),
                    ...fields.parent('owner').select('name', 'phone'),
                    fields.subQuery('contacts', subFields => {
                        return {
                            select: [
                                subFields.parent('createdBy').select('managerId'),
                                subFields.select('phone')
                            ],
                            where: [
                                { field: subFields.select('otherCity'), op: 'LIKE', val: '%YORK' },
                                'OR',
                                { field: subFields.select('mailingCity'), op: 'LIKE', val: '%YORK' }
                            ]
                        };
                    })
                ],
                where: [
                    { field: fields.select('name'), op: '=', val: 'Acme' }
                ],
                orderBy: { field: fields.select('rating'), order: 'DESC' },
                limit: 5,
                offset: 5
            };
        });

        expect(qry).to.equal(`SELECT Name, Owner.Name, Owner.Phone, (SELECT CreatedBy.ManagerId, Phone FROM Contacts WHERE OtherCity LIKE '%YORK' OR MailingCity LIKE '%YORK') FROM Account WHERE Name = 'Acme' ORDER BY Rating DESC LIMIT 5 OFFSET 5`);

    });
});
