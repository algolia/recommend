import { ProductRecord } from '../types';

type PersonalisationVersion = 'v1' | 'neural-perso';

export type Hits<TObject> = Array<ProductRecord<ProductRecord<TObject>>>;

export type PersonalisationParams = {
  userToken?: string;
  logRegion?: string;
  appID: string;
  apiKey: string;
};

export type ComputePersonalisationFilters = PersonalisationParams & {
  enabled: boolean;
  personalisationVersion: PersonalisationVersion;
};

export type PersonaliseRecommendations<TObject> = {
  hits: Hits<TObject>;
} & PersonalisationParams & { personalisationVersion: PersonalisationVersion };
