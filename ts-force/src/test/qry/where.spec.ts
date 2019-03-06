import { buildQuery } from '../..';
import { expect } from 'chai';
import { Account, Contact } from '../assets/sobs';
import 'mocha';
import { SOQLQueryParams } from '@src/qry';

describe('Where Value Tests', () => {
    it('where x = string', () => {
        let qry = buildQuery(Contact, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Contact WHERE Name = '123'`);
    });

    it('where x = string (defaulted)', () => {
        let qry = buildQuery(Contact, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), val: '123' }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Contact WHERE Name = '123'`);
    });

    it('where x IN string[]', () => {
        let qry = buildQuery(Contact, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: 'IN', val: ['123', '456'] }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Contact WHERE Name IN ('123', '456')`);
    });

    it('where x IN string[] (defaulted)', () => {
        let qry = buildQuery(Contact, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), val: ['123', '456'] }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Contact WHERE Name IN ('123', '456')`);
    });

    it('where x = NULL', () => {
        let qry = buildQuery(Contact, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: null }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Contact WHERE Name = NULL`);
    });

    it('where x = number', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('annualRevenue'), op: '>', val: 100 }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Account WHERE AnnualRevenue > 100`);
    });

    it('where x = boolean', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('active'), op: '=', val: false }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Account WHERE Active__c = false`);
    });

    it('where x = Date', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    {
                        field: fields.select('createdDate'),
                        op: '=',
                        val: new Date(1999, 0, 1, 1, 1, 1)
                    }
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE CreatedDate = 1999-01-01T01:01:01z`);
    });

    it('where func(x) = number', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select({ fn: 'COUNT', field: 'id' }), op: '=', val: 1 }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Account WHERE COUNT(Id) = 1`);
    });

    it('where id IN (subqry)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    {
                        field: fields.select('id'),
                        op: 'IN',
                        subqry: buildQuery(Contact, cFields => {
                            return { select: [cFields.select('accountId')] };
                        })
                    }
                ]
            };
        });
        expect(qry).to.equal(`SELECT Id FROM Account WHERE Id IN (SELECT AccountId FROM Contact)`);
    });
});

describe('Where Logic Tests', () => {

    it('NOT 1', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123', not: true }
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE NOT Name = '123'`);
    });

    it('1 AND 2', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' },
                    { field: fields.select('annualRevenue'), op: '>=', val: 123 }
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE Name = '123' AND AnnualRevenue >= 123`);
    });

    it('1 OR 2', () => {
        let qry = buildQuery(Account, (fields): SOQLQueryParams => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' },
                    'OR',
                    { field: fields.select('annualRevenue'), op: '>=', val: 123 }
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE Name = '123' OR AnnualRevenue >= 123`);
    });

    it('1 AND (2 OR 3)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' },
                    'AND',
                    [
                        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
                        'OR',
                        { field: fields.select('active'), op: '=', val: true }
                    ]
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE Name = '123' AND (AnnualRevenue >= 123 OR Active__c = true)`);
    });

    it('1 AND (2 OR 3) implicit', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' },
                    [
                        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
                        'OR',
                        { field: fields.select('active'), op: '=', val: true }
                    ]
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE Name = '123' AND (AnnualRevenue >= 123 OR Active__c = true)`);
    });

    it('(1 OR 2) AND (3 OR 4)', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    [
                        { field: fields.select('name'), op: '=', val: '123' },
                        'OR',
                        { field: fields.select('name'), op: '=', val: '456' }
                    ],
                    'AND',
                    [
                        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
                        'OR',
                        { field: fields.select('active'), op: '=', val: true }
                    ]
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE (Name = '123' OR Name = '456') AND (AnnualRevenue >= 123 OR Active__c = true)`);
    });

    it('1 OR (2 AND (3 OR 4))', () => {
        let qry = buildQuery(Account, fields => {
            return {
                select: [fields.select('id')],
                where: [
                    { field: fields.select('name'), op: '=', val: '123' },
                    'OR',
                    [
                        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
                        'AND',
                        [
                            { field: fields.select('active'), op: '=', val: true },
                            'OR',
                            { field: fields.select('accountSource'), op: '=', val: 'web' }
                        ]
                    ]
                ]
            };
        });

        expect(qry).to.equal(`SELECT Id FROM Account WHERE Name = '123' OR (AnnualRevenue >= 123 AND (Active__c = true OR AccountSource = 'web'))`);
    });

    // it('conditional2', () => {
    //     let x = parseConditional2([
    //         {
    //             field: 'createdDate',
    //             op: '=',
    //             val: new Date(1999, 0, 1, 1, 1, 1) }
    //     ])
    //     expect(x).to.equal(`createdDate = 1999-01-01T01:01:01z`);

    //     x = parseConditional2([
    //         { field: 'name', op: '=', val: '123', not: true},
    //     ])
    //     expect(x).to.equal(`NOT name = '123'`);

    //     x = parseConditional2([
    //         { field: 'name', op: '=', val: '123' },
    //         { field: 'annualRevenue', op: '>=', val: 123 }
    //     ])
    //     expect(x).to.equal(`name = '123' AND annualRevenue >= 123`);

    //     x = parseConditional2([
    //         { field: 'name', op: '=', val: '123' },
    //         'OR',
    //         { field: 'annualRevenue', op: '>=', val: 123 }
    //     ])

    //     expect(x).to.equal(`name = '123' OR annualRevenue >= 123`);

    //     x = parseConditional2([
    //         { field: 'name', op: '=', val: '123' },
    //         'AND',
    //         [
    //             { field: 'annualRevenue', op: '>=', val: 123 },
    //             'OR',
    //             { field: 'active', op: '=', val: true }
    //         ]
    //     ])
    //     expect(x).to.equal(`name = '123' AND (annualRevenue >= 123 OR active = true)`);

    //     x = parseConditional2([
    //         [
    //             { field: 'name', op: '=', val: '123' },
    //             'OR',
    //             { field: 'name', op: '=', val: '456' }
    //         ],
    //         'AND',
    //         [
    //             { field: 'annualRevenue', op: '>=', val: 123 },
    //             'OR',
    //             { field: 'active', op: '=', val: true }
    //         ]
    //     ])
    //     expect(x).to.equal(`(name = '123' OR name = '456') AND (annualRevenue >= 123 OR active = true)`);

    //     x = parseConditional2([
    //         { field: 'name', op: '=', val: '123' },
    //         'OR',
    //         [
    //             { field: 'annualRevenue', op: '>=', val: 123 },
    //             'AND',
    //             [
    //                 { field: 'active', op: '=', val: true },
    //                 'OR',
    //                 { field: 'accountSource', op: '=', val: 'web' }
    //             ]
    //         ]
    //     ])
    //     expect(x).to.equal(`name = '123' OR (annualRevenue >= 123 AND (active = true OR accountSource = 'web'))`);
    // });
});
