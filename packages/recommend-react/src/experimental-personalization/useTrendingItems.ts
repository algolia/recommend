import { UseTrendingItemsProps } from '../TrendingItems';
import { useTrendingItems as hook } from '../useTrendingItems';

import { Personalization } from './types';

type Props<TObject> = UseTrendingItemsProps<TObject> & Personalization;

export function useTrendingItems<TObject>(props: Props<TObject>) {
  const { recommendations, status } = hook(props);
  console.log('hook call', status);
  return { recommendations, status };
}
