import { InsightsClient } from 'search-insights';

import { ProductHit } from './ProductHit';

export type HitProps = {
  hit: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};
