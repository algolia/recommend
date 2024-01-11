import { Experimental } from '@algolia/recommend-core';

import { TrendingItemsProps, TrendingItems as render } from '../TrendingItems';

type Props<TObject> = TrendingItemsProps<TObject> & {
  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export function TrendingItems<TObject>(props: Props<TObject>) {
  return render(props);
}
