import {rest} from 'msw';
import {setupServer} from 'msw/node';

import {start} from '../updateDomainRecord';
import type {IDomainRecord} from '../types';

const handlers = [
  rest.get('https://ifconfig.me/ip', (req, res, ctx) => {
    return res(ctx.text('127.0.0.1'));
  }),
  rest.get('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', (req, res, ctx) => {
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
  rest.put('https://api.digitalocean.com/v2/domains/example.com/records/:recordId', (req, res, ctx) => {
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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('updateDomainRecord should log info when ip is updated', async () => {
  console.info = jest.fn();
  console.error = jest.fn();

  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  expect(console.error).not.toHaveBeenCalled();
  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenCalledWith(
    `IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`
  );
});

test('updateDomainRecord should log info when ip is updated, and there are multiple recordIds', async () => {
  console.info = jest.fn();
  console.error = jest.fn();

  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456', '987654321'];

  await start({authToken, domain, recordIds});

  const oldIp = '192.168.0.1';
  const newIp = '127.0.0.1';

  expect(console.error).not.toHaveBeenCalled();
  expect(console.info).toHaveBeenCalledTimes(2);
  expect(console.info).toHaveBeenCalledWith(
    `IP has changed, updating recordId: ${recordIds[0]}. Old ip: ${oldIp}, new ip: ${newIp}`
  );
  expect(console.info).toHaveBeenCalledWith(
    `IP has changed, updating recordId: ${recordIds[1]}. Old ip: ${oldIp}, new ip: ${newIp}`
  );
});

test('updateDomainRecord should log info when ip is not updated', async () => {
  server.use(
    rest.get('https://ifconfig.me/ip', (req, res, ctx) => {
      return res(ctx.text('192.168.0.1'));
    })
  );

  console.info = jest.fn();
  console.error = jest.fn();

  const authToken = 'asdfe3';
  const domain = 'example.com';
  const recordIds = ['123456'];

  await start({authToken, domain, recordIds});

  expect(console.error).not.toHaveBeenCalled();
  expect(console.info).toHaveBeenCalledWith(`IP has not changed`);
});
