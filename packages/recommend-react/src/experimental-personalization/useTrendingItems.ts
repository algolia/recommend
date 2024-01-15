import { PersonalizationProps } from '@algolia/recommend-core';

import { UseTrendingItemsProps as UseTrendingItemsPropsPrimitive } from '../TrendingItems';
import { useTrendingItems as useTrendingItemsPrimitive } from '../useTrendingItems';

export type UseTrendingItemsProps<
  TObject
> = UseTrendingItemsPropsPrimitive<TObject> & PersonalizationProps;

export function useTrendingItems<TObject>(
  props: UseTrendingItemsProps<TObject>
) {
  return useTrendingItemsPrimitive(props);
}
