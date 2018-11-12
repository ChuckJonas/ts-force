import { buildQuery } from '../..';
import { expect } from 'chai';
import { Account } from '../testAssets/sobs';
import 'mocha';

describe('Order By Tests', () => {

    it('order by x', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                orderBy: {field: fields.select('accountNumber')}
            };
        });
        expect(qry).to.equal('SELECT Id FROM Account ORDER BY AccountNumber');
    });

    it('order by x asc, y.z desc', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id',)],
                orderBy: [
                    {
                        field: fields.select('accountNumber'),
                        order: 'ASC'
                    },
                    {
                        field: fields.parent('owner').select('email'),
                        order: 'DESC'
                    }
                ]
            };
        });

        expect(qry).to.equal('SELECT Id FROM Account ORDER BY AccountNumber ASC, Owner.Email DESC');
    });

    it('order by x desc null last', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                orderBy: [
                    {
                        field: fields.select('accountNumber'),
                        order: 'DESC',
                        nulls: 'LAST'
                    }
                ]
            };
        });
        expect(qry).to.equal('SELECT Id FROM Account ORDER BY AccountNumber DESC NULLS LAST');
    });
});
