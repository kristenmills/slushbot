import { fetchChannelList } from '../helpers';
import { createClient } from 'redis';
import  nconf from '../../config';
import 'should';

function addChannel(name, client) {
  return new Promise((acc, rej) => {
    client.set('events::' + name, true, err => {
      if (!err) {
        acc();
      } else {
        rej();
      }
    });
  });
}

describe('Notifications', () => {

  const client = createClient(nconf.get('redis'));

  beforeAll(() => {
    client.flushall();
  });

  afterAll(() => {
    client.quit();
  });

  it('should return no channels', () => {
    return fetchChannelList(client, 'events')
      .then(channels => {
        channels.should.be.Array; // eslint-disable-line no-unused-expressions
        channels.should.be.length(0);
      });
  });

  it('should have channel sse-tech', () => {
    return addChannel('sse-tech', client)
      .then(() => fetchChannelList(client, 'events'))
      .then(channels => {
        channels.should.be.Array; // eslint-disable-line no-unused-expressions
        channels.should.be.length(1);
        channels[0].should.be.eql('sse-tech');
      });
  });

  it('should work with multiple', () => {
    return addChannel('sse-tech', client)
      .then(() => addChannel('sse-another', client))
      .then(() => addChannel('officers', client))
      .then(() => fetchChannelList(client, 'events'))
      .then(channels => {
        channels.should.be.Array; // eslint-disable-line no-unused-expressions
        channels.should.be.length(3);
      });
  });
});
