import test from 'ava';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import sinon from 'sinon';
import {logger} from './logger.js';

import {start} from './updateDomainRecord.js';
import type {IDomainRecord} from './types.js';

const handlers = [
  rest.get('https://ifconfig.me/ip', (_req, res, ctx) => {
    return res(ctx.text('127.0.0.1'));
  }),
  rest.get('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', (_req, res, ctx) => {
    const mockApiResponse: IDomainRecord = {
      domain_record: {
        id: 123456,
        type: 'domain',
        name: 'example.com',
        data: '192.168.0.1',
        ttl: 3600,
      },
    };
    return res(ctx.json(mockApiResponse));
  }),
  rest.put('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', (_req, res, ctx) => {
    const mockApiResponse: IDomainRecord = {
      domain_record: {
        id: 123456,
        type: 'domain',
        name: 'example.com',
        data: '192.168.0.1',
        ttl: 3600,
      },
    };
    return res(ctx.json(mockApiResponse));
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

test('updateDomainRecord should log info when ip is updated', async (t) => {
  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  t.false(errorLogger.calledOnce);
  t.true(infoLogger.calledOnce);
  t.true(
    infoLogger.calledWithMatch(`IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`)
  );
});

test('updateDomainRecord should log info when ip is updated, and there are multiple recordIds', async (t) => {
  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456', '987654321'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  t.false(errorLogger.calledOnce);
  t.true(infoLogger.calledTwice);
  t.true(
    infoLogger.calledWithMatch(`IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`)
  );
  t.true(
    infoLogger.calledWithMatch(`IP has changed, updating recordId: ${recordIds[1]}. Old ip: ${oldIp}, new ip: ${newIp}`)
  );
});

test('updateDomainRecord should log info when ip is not updated', async (t) => {
  server.use(
    rest.get('https://ifconfig.me/ip', (_req, res, ctx) => {
      return res(ctx.text('192.168.0.1'));
    })
  );

  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  t.false(errorLogger.calledOnce);
  t.true(infoLogger.calledOnce);
  t.true(infoLogger.calledWithMatch(`IP has not changed`));
});
