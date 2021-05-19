import { useMemo } from 'react';

import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type UseFrequentlyBoughtTogetherProps<TObject> = Omit<
  UseRecommendationsProps<TObject>,
  'model' | 'fallbackFilters'
>;

export function useFrequentlyBoughtTogether<TObject>(
  userProps: UseFrequentlyBoughtTogetherProps<TObject>
) {
  const props: UseRecommendationsProps<TObject> = useMemo(
    () => ({
      ...userProps,
      fallbackFilters: [],
      model: 'bought-together',
    }),
    [userProps]
  );

  return useRecommendations<TObject>(props);
}
