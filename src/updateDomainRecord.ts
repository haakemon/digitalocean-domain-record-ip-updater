import got from 'got';
import type {IUpdateConfig, IGetCurrentDomainRecord, IUpdateDomainRecord, IDomainRecord} from './types';

const getCurrentDomainRecord = async ({recordId, domain, authToken}: IGetCurrentDomainRecord) => {
  const baseUrl = `https://api.digitalocean.com/v2/domains/${domain}/records/`;
  const url = `${baseUrl}${recordId}`;

  try {
    const {domain_record}: IDomainRecord = await got(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    }).json();

    return domain_record.data;
  } catch (error) {
    console.error(error);
  }
};

const updateDomainRecordIp = async ({recordId, newIp, domain, authToken}: IUpdateDomainRecord) => {
  const baseUrl = `https://api.digitalocean.com/v2/domains/${domain}/records/`;
  const url = `${baseUrl}${recordId}`;

  try {
    await got
      .put(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        json: {
          data: newIp,
        },
      })
      .json();
  } catch (error) {
    console.error(error);
  }
};

const getCurrentIp = async () => {
  const url = 'https://ifconfig.me/ip';
  try {
    const ip: string = await got(url).text();

    return ip;
  } catch (error) {
    console.error(error);
  }
};

export const start = async ({authToken, domain, recordIds}: IUpdateConfig) => {
  const currentIp = await getCurrentIp();

  if (recordIds) {
    for (const recordId of recordIds) {
      const domainRecordIp = await getCurrentDomainRecord({recordId, domain, authToken});

      if (currentIp && domainRecordIp && currentIp !== domainRecordIp) {
        console.info(`IP has changed, updating recordId: ${recordId}. Old ip: ${domainRecordIp}, new ip: ${currentIp}`);
        updateDomainRecordIp({recordId, domain, authToken, newIp: currentIp});
      } else {
        console.info('IP has not changed');
      }
    }
  }
};
