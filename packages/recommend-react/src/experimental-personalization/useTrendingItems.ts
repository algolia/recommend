import { Experimental } from '@algolia/recommend-core';

import { UseTrendingItemsProps } from '../TrendingItems';
import { useTrendingItems as hook } from '../useTrendingItems';

type Props<TObject> = UseTrendingItemsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function useTrendingItems<TObject>(props: Props<TObject>) {
  return hook(props);
}
