import {start} from './updateDomainRecord.js';
import {getVariables} from './variableUtils.js';

const init = async () => {
  const {authToken, domain, recordIds} = await getVariables();
  const hasAllVariablesSet = Boolean(authToken) && Boolean(domain) && Boolean(recordIds);

  if (hasAllVariablesSet) {
    start({authToken, domain, recordIds});
  }
};

init();
