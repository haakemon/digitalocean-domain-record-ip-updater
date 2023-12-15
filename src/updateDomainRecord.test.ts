import { test } from "node:test"
import assert from "node:assert"

import sinon from 'sinon';

import {logger} from './logger.js';
import {start} from './updateDomainRecord.js';
import type {IDomainRecord} from './types.js';

import { http } from 'msw'
import {setupServer} from 'msw/node';

const handlers = [
  http.get('https://ifconfig.me/ip', () => {
    return new Response('127.0.0.1', {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }),
  http.get('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', () => {
    const mockApiResponse: IDomainRecord = {
      domain_record: {
        id: 123456,
        type: 'domain',
        name: 'example.com',
        data: '192.168.0.1',
        ttl: 3600,
      },
    };
    return new Response(JSON.stringify(mockApiResponse), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.put('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', () => {
    const mockApiResponse: IDomainRecord = {
      domain_record: {
        id: 123456,
        type: 'domain',
        name: 'example.com',
        data: '192.168.0.1',
        ttl: 3600,
      },
    };
    return new Response(JSON.stringify(mockApiResponse), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
];

const server = setupServer(...handlers);
let sandbox: any, errorLogger: any, infoLogger: any;

test.before(() => {
  server.listen();
});
test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  errorLogger = sandbox.stub(logger, 'error');
  infoLogger = sandbox.stub(logger, 'info');
});
test.afterEach(() => {
  sandbox.restore();
  server.resetHandlers();
});
test.after(() => server.close());

test('updateDomainRecord should log info when ip is updated', async () => {
  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  assert.equal(errorLogger.calledOnce, false);
  assert.equal(infoLogger.calledOnce, true);
  assert.equal(
    infoLogger.calledWithMatch(
      `IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`,
    ), true
  );
});

test('updateDomainRecord should log info when ip is updated, and there are multiple recordIds', async () => {
  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456', '987654321'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  assert.equal(errorLogger.calledOnce, false);
  assert.equal(infoLogger.calledTwice, true);
  assert.equal(
    infoLogger.calledWithMatch(
      `IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`,
    ), true
  );
  assert.equal(
    infoLogger.calledWithMatch(
      `IP has changed, updating recordId: ${recordIds[1]}. Old ip: ${oldIp}, new ip: ${newIp}`,
    ), true
  );
});

test('updateDomainRecord should log info when ip is not updated', async () => {
  server.use(
    http.get('https://ifconfig.me/ip', () => {
      return new Response('192.168.0.1', {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }),
  );

  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  assert.equal(errorLogger.calledOnce, false);
  assert.equal(infoLogger.calledOnce, true);
  assert.equal(infoLogger.calledWithMatch(`IP has not changed`), true);
});
