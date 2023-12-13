import { Hit } from '@algolia/client-search';
import { TrendingFacetHit } from '@algolia/recommend';

export type FacetRecord = TrendingFacetHit<string>;

type WithInsights<THit> = THit & {
  __position: string;
  __indexName: string;
  __queryID: string;
};

export type FacetHit = WithInsights<Hit<FacetRecord>>;
