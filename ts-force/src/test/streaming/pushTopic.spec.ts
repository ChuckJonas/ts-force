import 'mocha';

import { expect } from 'chai';

import { Streaming, OAuth, setDefaultConfig, UsernamePasswordConfig, getStandardError } from '../..';
import { Account, PushTopic } from '../assets/sobs';
import { DEFAULT_CONFIG } from '../../auth/baseConfig';
import { buildQuery } from '../../qry';

const TEST_ACC_NAME = 'testing push topic';

describe('Streaming API 1', () => {
    before(async () => {
        const passwordConfig = new UsernamePasswordConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD);
        let oAuth = new OAuth(passwordConfig);
        setDefaultConfig(await oAuth.initialize());
        require('cometd-nodejs-client').adapt();
    });


    it('can connect & disconnect', async () => {
        try {
            let stream = new Streaming();
            await stream.connect();
            expect(stream.isConnected()).to.equal(true);
            await stream.disconnect();
            expect(stream.isConnected()).to.equal(false);
        } catch (e) {
            console.log(e);
            expect.fail('SHOULD NOT HAVE THROWN ERROR!');
        }
    });

    it('can subscribe & unsubscribe unmapped', async () => {
        
        await new Promise(async (resolve, reject) => {
            try {
                console.log('creating topic')
                // setup topic
                let topic = await getOrCreateTestTopic('UNMAPPEDTEST');

                // run test
                console.log('connecting')
                let stream = new Streaming();
                await stream.connect();
                expect(stream.isConnected()).to.equal(true);
                
                console.log('subscribing')
                // sObject mapping
                await stream.subscribeToTopic<{ Id: string, Name: string }>(
                    topic.name,
                    e => {
                        console.log('recieved data');
                        expect(e.data.sobject.Name).to.equal(TEST_ACC_NAME);
                        stream.unsubscribe(topic.name, 'topic')
                            .then(() => {
                                console.log('disconnecting data');
                                return stream.disconnect()
                            })    
                            .then(() => {
                                console.log('deleting data');
                                return topic.delete()
                            })
                            .then(() => {
                                console.log('deleting data');
                                return resolve()
                            })
                            .catch(e => reject(e));
                    }
                );

                let acc = new Account({ name: TEST_ACC_NAME });
                await acc.insert();
            } catch (e) {
                reject(e);
            }
        });
    });

    it('can subscribe & unsubscribe mapped', async () => {
        await new Promise(async (resolve, reject) => {
            try {
                // setup topic
                let topic = await getOrCreateTestTopic('MAPPEDTEST');

                // run test
                let stream = new Streaming();
                await stream.connect();
                expect(stream.isConnected()).to.equal(true);

                // sObject mapping
                await stream.subscribeToTopicMapped(
                    Account,
                    topic.name,
                    e => {
                        expect(e.data.sObject.name).to.equal(TEST_ACC_NAME);
                        stream.unsubscribe(topic.name, 'topic')
                            .then(() => topic.delete())
                            .then(() => stream.disconnect())
                            .then(() => resolve())
                            .catch(e => reject(e));
                    }
                );

                let acc = new Account({ name: TEST_ACC_NAME });
                await acc.insert();
            } catch (e) {
                reject(e);
            }
        });
    });
});

async function getOrCreateTestTopic(topicName: string) {
    let topic: PushTopic;
    topic = (await PushTopic.retrieve(`SELECT Id, Name FROM PushTopic WHERE Name = '${topicName}' AND IsDeleted = false`))[0];
    if (!topic) {
        topic = new PushTopic({
            name: topicName,
            notifyForOperationCreate: true,
            description: 'for unit test',
            apiVersion: DEFAULT_CONFIG.version,
            query: buildQuery(Account, f => (
                {
                    select: [
                        ...f.select('id', 'name', 'active'),
                    ],
                    // where: [{ field: f.select('name'), val: TEST_ACC_NAME }]
                }
            ))
        });
        await topic.insert();
    }
    return topic;
}
