import {start} from './updateDomainRecord';
import {getVariables} from './variableUtils';

const init = async () => {
  const {authToken, domain, recordIds} = await getVariables();
  const hasAllVariablesSet = Boolean(authToken) && Boolean(domain) && Boolean(recordIds);

  if (hasAllVariablesSet) {
    start({authToken, domain, recordIds});
  }
};

init();
