import {promises as fs} from 'node:fs';
const {readFile} = fs;

const readSecret = async (filePath?: string) => {
  if (!filePath) {
    return;
  }
  try {
    const res = await readFile(filePath, {encoding: 'utf8'});
    return res.trim();
  } catch (error) {
    console.error(`${new Date()} - error`);
  }
};

export const getVariables = async () => {
  const authToken = (await readSecret(process.env.AUTH_TOKEN_FILE)) || process.env.AUTH_TOKEN;
  const domain = (await readSecret(process.env.DOMAIN_FILE)) || process.env.DOMAIN;
  const recordIds = (await readSecret(process.env.RECORD_IDS_FILE)) || process.env.RECORD_IDS;

  const hasAllVariablesSet = Boolean(authToken) && Boolean(domain) && Boolean(recordIds);

  if (!hasAllVariablesSet) {
    console.error(`
- AUTH_TOKEN is required, go to https://cloud.digitalocean.com/account/api to set one up. Read and Write access is required.
- DOMAIN is required.
- RECORD_IDS should be a comma separated list of record id's to update.
    `);
  }

  return {
    authToken,
    domain,
    recordIds: recordIds?.split(','),
  };
};
