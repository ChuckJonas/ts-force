import { buildQuery } from '../..';
import { expect } from 'chai';
import { Account } from '../assets/sobs';
import 'mocha';

describe('Group By Tests', () => {

    it('group by x', () => {
        let builder = buildQuery(Account, fields => {
            return {
                select: [fields.select({ fn: 'COUNT', field: 'id', alias: 'c' })],
                groupBy: {
                    field: fields.select('accountSource')
                }
            };
        });

        expect(builder).to.equal('SELECT COUNT(Id) c FROM Account GROUP BY AccountSource');
    });

    it('group by x, y', () => {
        let builder = buildQuery(Account, fields => {
            return {
                select: [fields.select({ fn: 'COUNT', field: 'id', alias: 'c' })],
                groupBy: {
                    field: fields.select('accountSource', 'type')
                }
            };
        });
        expect(builder).to.equal('SELECT COUNT(Id) c FROM Account GROUP BY AccountSource, Type');
    });

    it('group by CUBE(x, y)', () => {
        let builder = buildQuery(Account, fields => {
            return {
                select: [fields.select({ fn: 'COUNT', field: 'id', alias: 'c' })],
                groupBy: {
                    field: fields.select('accountSource', 'type'),
                    type: 'CUBE'
                }
            };
        });

        expect(builder).to.equal('SELECT COUNT(Id) c FROM Account GROUP BY CUBE(AccountSource, Type)');
    });

    it('group by x having x > 1', () => {
        let builder = buildQuery(Account, fields => {
            return {
                select: [fields.select({ fn: 'COUNT', field: 'id', alias: 'c' })],
                groupBy: {
                    field: fields.select('type'),
                    having: [
                        {
                            field: fields.select({fn: 'COUNT', field: 'id'}),
                            op: '>',
                            val: 1
                        }
                    ]
                }
            };
        });

        expect(builder).to.equal('SELECT COUNT(Id) c FROM Account GROUP BY Type HAVING COUNT(Id) > 1');
    });

});
