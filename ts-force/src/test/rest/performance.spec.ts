import 'mocha';
import { OAuth, Rest, setDefaultConfig, SObject, UsernamePasswordConfig } from '../..';
import { Account } from '../assets/sobs';
import { expect } from 'chai';
import { buildQuery } from '../../qry';

let accData: SObject[];

// My lousy attempt to normalize for env...
// Should probably use an actual benchmarking library
const getBaseline = () => {
    let s = new Date();
    for (let i = 0; i < 10000000; i++) {} // hopefully this doesn't get optimized away
    let e = new Date();
    return e.getTime() - s.getTime();
};

const baseline = getBaseline();

describe('Performance Compare', () => {
    before(async () => {
        const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
        let oAuth = new OAuth(passwordConfig);
        setDefaultConfig(await oAuth.initialize());
        let rest = new Rest();
        accData = (await rest.query<SObject>(`SELECT ID, Name, CreatedDate,CreatedBy.Id, CreatedBy.Name,
        CreatedBy.Email, Owner.Id, Owner.Name, Owner.Email,
        (
            SELECT FirstName, AccountId, LastName, Email, Phone, CreatedDate, LastModifiedDate
            FROM Contacts
        )
        FROM ACCOUNT LIMIT 250`)).records;
    });

    it('Object Mapping', async () => {
        let acceptableTime = baseline * 30;
        let start = new Date();
        let accounts = [];

        for (let accRaw of accData) {
            accounts.push(Account.fromSFObject(accRaw));
        }
        let stop = new Date();
        let diff = stop.getTime() - start.getTime();
        expect(diff).to.be.lessThan(acceptableTime);
    });

    it('Query Builder', async () => {
        let acceptableTime = baseline;
        let start = new Date();
        let qry = buildQuery(Account, fields => {
            return {
                select: [
                    ...fields.select('id','name','createdDate'),
                    ...fields.parent('createdBy').select('id','name','email'),
                    ...fields.parent('owner').select('id','name','email'),
                    fields.subQuery('contacts', cFields => {
                        return {
                            select: [
                                ... cFields.select('firstName', 'lastName', 'accountId', 'email', 'phone', 'createdDate', 'lastModifiedDate')
                            ]
                        };
                    })
                ]
            };
        });
        let stop = new Date();
        let diff = stop.getTime() - start.getTime();
        expect(diff).to.be.lessThan(acceptableTime / 2);
    });

});
