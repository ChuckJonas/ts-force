import 'mocha';

import { expect } from 'chai';

import { CompositeCollection, OAuth, Rest, setDefaultConfig, SObject, UsernamePasswordConfig } from '../..';
import { Account, Contact, User } from '../assets/sobs';

describe('Performance Compare', () => {
    before(async () => {
        const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
        let oAuth = new OAuth(passwordConfig);
        setDefaultConfig(await oAuth.initialize());
    });

    it('No Mapping', async () => {
        let rest = new Rest();
        let accData = (await rest.query<SObject>(`SELECT ID, Name, CreatedDate,CreatedBy.Id, CreatedBy.Name,
        CreatedBy.Email, Owner.Id, Owner.Name, Owner.Email,
        (
            SELECT FirstName, AccountId, LastName, Email, Phone, CreatedDate, LastModifiedDate
            FROM Contacts
        )
        FROM ACCOUNT LIMIT 2000`)).records;
    });

    it('With Mapping', async () => {
        let rest = new Rest();
        let accData = (await rest.query<SObject>(`SELECT ID, Name, CreatedDate,CreatedBy.Id, CreatedBy.Name,
        CreatedBy.Email, Owner.Id, Owner.Name, Owner.Email,
        (
            SELECT FirstName, AccountId, LastName, Email, Phone, CreatedDate, LastModifiedDate
            FROM Contacts
        )
        FROM ACCOUNT LIMIT 2000`)).records;

        let accounts = [];
        for (let accRaw of accData) {
            accounts.push(Account.fromSFObject(accRaw));
        }
    });

    it('With Mapping & Query Builder', async () => {
        await Account.retrieve(fields => {
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
    });

});
