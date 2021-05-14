import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo } from 'react';

import { ProductBaseRecord } from './types';
import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type UseFrequentlyBoughtTogetherProps = {
  indexName: string;
  objectID: string;
  searchClient: SearchClient;

  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
};

export function useFrequentlyBoughtTogether<TObject extends ProductBaseRecord>(
  userProps: UseFrequentlyBoughtTogetherProps
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
