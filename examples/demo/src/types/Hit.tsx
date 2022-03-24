import { InsightsClient } from 'search-insights';

import { FacetHit } from './FacetHit';
import { ProductHit } from './ProductHit';

export type HitProps = {
  hit: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};

export type FacetProps = {
  hit: FacetHit;
  indexName: string;
  insights: InsightsClient;
  onSelect(hit: FacetHit): void;
};
