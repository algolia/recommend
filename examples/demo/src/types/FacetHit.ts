import { Hit } from '@algolia/client-search';

export type FacetRecord = {
  facetName: string;
  facetValue: string;
};

type WithInsights<THit> = THit & {
  __position: string;
  __indexName: string;
  __queryID: string;
};

export type FacetHit = WithInsights<Hit<FacetRecord>>;
