import { TrendingFacetHit } from '@algolia/recommend';

export type FacetHit = TrendingFacetHit<string>;

// type WithInsights<THit> = FacetHit & {
//   __position: string;
//   __indexName: string;
//   __queryID: string;
// };
