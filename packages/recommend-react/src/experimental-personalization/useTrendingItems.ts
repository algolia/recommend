import { Personalization } from '@algolia/recommend-core';

import { UseTrendingItemsProps } from '../TrendingItems';
import { useTrendingItems as useHook } from '../useTrendingItems';

type Props<TObject> = UseTrendingItemsProps<TObject> & Personalization;

export function useTrendingItems<TObject>(props: Props<TObject>) {
  return useHook(props);
}
