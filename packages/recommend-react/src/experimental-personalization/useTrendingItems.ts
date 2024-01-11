import { UseTrendingItemsProps } from '../TrendingItems';
import { useTrendingItems as useHook } from '../useTrendingItems';

import { Personalization } from './types';

type Props<TObject> = UseTrendingItemsProps<TObject> & Personalization;

export function useTrendingItems<TObject>(props: Props<TObject>) {
  const { recommendations, status } = useHook(props);
  console.log('hook call', status);
  return { recommendations, status };
}
