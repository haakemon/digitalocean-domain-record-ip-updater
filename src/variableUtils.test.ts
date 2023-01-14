import {getVariables} from './variableUtils';
import path from 'node:path';

test('getVariables should log an error when any variable are not set', async () => {
  console.error = jest.fn();
  const authToken = 'some-auth-token';
  const domain = 'example.com';

  process.env.AUTH_TOKEN = authToken;
  process.env.DOMAIN = domain;

  const result = await getVariables();

  expect(result).toEqual({
    authToken: authToken,
    domain: domain,
    recordIds: undefined,
  });
  expect(console.error).toHaveBeenCalledTimes(1);
});

test('getVariables should return variables when set in env variables', async () => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env.AUTH_TOKEN = authToken;
  process.env.DOMAIN = domain;
  process.env.RECORD_IDS = recordIds;

  const result = await getVariables();

  expect(result).toEqual({
    authToken,
    domain,
    recordIds: ['123', '456'],
  });
});

test('getVariables should return content from file when using env variables that end with _FILE', async () => {
  const authToken = 'some-auth-token';
  const domain = 'example.com';
  const recordIds = '123,456';

  process.env.AUTH_TOKEN = authToken;
  process.env.DOMAIN = domain;
  process.env.RECORD_IDS = recordIds;

  process.env.AUTH_TOKEN_FILE = path.join(__dirname, '__test__', 'secret-test');

  const result = await getVariables();

  expect(result).toEqual({
    authToken: 'auth-token-secret',
    domain,
    recordIds: ['123', '456'],
  });
});
