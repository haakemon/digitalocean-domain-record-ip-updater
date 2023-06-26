import test from 'ava';
import sinon from 'sinon';

import {getVariables} from './variableUtils.js';
import path, {dirname} from 'node:path';
import {logger} from './logger.js';

import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let sandbox: any, errorLogger: any;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  errorLogger = sandbox.stub(logger, 'error');
  sandbox.stub(logger, 'info');
});
test.afterEach(() => {
  sandbox.restore();
});

test('getVariables should log an error when any variable are not set', async (t) => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;

  const result = await getVariables();

  t.deepEqual(result, {
    authToken: authToken,
    domain: domain,
    recordIds: undefined,
  });
  t.true(errorLogger.calledOnce);
});

test('getVariables should return variables when set in env variables', async (t) => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;
  process.env['RECORD_IDS'] = recordIds;

  const result = await getVariables();

  t.deepEqual(result, {
    authToken,
    domain,
    recordIds: ['123', '456'],
  });
  t.false(errorLogger.calledOnce);
});

test('getVariables should return content from file when using env variables that end with _FILE', async (t) => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;
  process.env['RECORD_IDS'] = recordIds;

  process.env['AUTH_TOKEN_FILE'] = path.join(__dirname, '__test__', 'secret-test');

  const result = await getVariables();

  t.deepEqual(result, {
    authToken: 'auth-token-secret',
    domain,
    recordIds: ['123', '456'],
  });
  t.false(errorLogger.calledOnce);
});
