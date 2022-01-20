export interface IDomainRecord {
  domain_record: {
    id: number;
    type: string;
    name: string;
    data: string;
    ttl: number;
  };
}

export interface IUpdateConfig {
  authToken?: string;
  domain?: string;
  recordIds?: string[];
}

export interface IGetCurrentDomainRecord {
  authToken?: string;
  domain?: string;
  recordId: string;
}

export interface IUpdateDomainRecord {
  authToken?: string;
  domain?: string;
  recordId: string;
  newIp: string;
}
