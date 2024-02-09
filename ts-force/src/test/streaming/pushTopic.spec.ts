import { expect } from 'chai';
import 'mocha';
import { Streaming } from '../..';
import { DEFAULT_CONFIG } from '../../auth/baseConfig';
import { buildQuery } from '../../qry';
import { Account, PushTopic } from '../assets/sobs';
import { createDefaultClient } from '../helper';

const TEST_ACC_NAME = 'testing push topic';

describe('Streaming API', () => {
  before(async () => {
    await createDefaultClient();
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

  it('can subscribe & unsubscribe unmapped', async function () {
    this.retries(3);
    return new Promise(async (resolve, reject) => {
      try {
        // setup topic
        let topic = await getOrCreateTestTopic('UNMAPPEDTEST');

        // run test
        let stream = new Streaming();
        await stream.connect();
        expect(stream.isConnected()).to.equal(true);

        // sObject mapping
        await stream.subscribeToTopic<{ Id: string; Name: string }>(topic.name, (e) => {
          expect(e.data.sobject.Name).to.equal(TEST_ACC_NAME);
          stream
            .unsubscribe(topic.name, 'topic')
            .then(() => topic.delete())
            .then(() => stream.disconnect())
            .then(() => resolve())
            .catch((e) => reject(e));
        });

        let acc = new Account({ name: TEST_ACC_NAME });
        await acc.insert();
      } catch (e) {
        reject(e);
      }
    });
  });

  it('can subscribe & unsubscribe mapped', async function () {
    this.retries(3);
    return new Promise(async (resolve, reject) => {
      try {
        // setup topic
        let topic = await getOrCreateTestTopic('MAPPEDTEST');

        // run test
        let stream = new Streaming();
        await stream.connect();
        expect(stream.isConnected()).to.equal(true);

        // sObject mapping
        await stream.subscribeToTopicMapped(Account, topic.name, (e) => {
          expect(e.data.sObject.name).to.equal(TEST_ACC_NAME);
          stream
            .unsubscribe(topic.name, 'topic')
            .then(() => topic.delete())
            .then(() => stream.disconnect())
            .then(() => resolve())
            .catch((e) => reject(e));
        });

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
      query: buildQuery(Account, (f) => ({
        select: [...f.select('id', 'name', 'active')],
        // where: [{ field: f.select('name'), val: TEST_ACC_NAME }]
      })),
    });
    await topic.insert();
  }
  return topic;
}
