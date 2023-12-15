import { test } from "node:test"
import assert from "node:assert"
import {fileURLToPath} from 'node:url';

import sinon from 'sinon';

import {getVariables} from './variableUtils.js';
import path, {dirname} from 'node:path';
import {logger} from './logger.js';

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

test('getVariables should log an error when any variable are not set', async () => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;

  const result = await getVariables();

  assert.deepStrictEqual(result, {
    authToken: authToken,
    domain: domain,
    recordIds: undefined,
  });
  assert.equal(errorLogger.calledOnce, true);
});

test('getVariables should return variables when set in env variables', async () => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;
  process.env['RECORD_IDS'] = recordIds;

  const result = await getVariables();

  assert.deepStrictEqual(result, {
    authToken,
    domain,
    recordIds: ['123', '456'],
  });
  assert.equal(errorLogger.calledOnce, false);
});

test('getVariables should return content from file when using env variables that end with _FILE', async () => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env['AUTH_TOKEN'] = authToken;
  process.env['DOMAIN'] = domain;
  process.env['RECORD_IDS'] = recordIds;

  process.env['AUTH_TOKEN_FILE'] = path.join(__dirname, '__test__', 'secret-test');

  const result = await getVariables();

  assert.deepStrictEqual(result, {
    authToken: 'auth-token-secret',
    domain,
    recordIds: ['123', '456'],
  });
  assert.equal(errorLogger.calledOnce, false);
});
