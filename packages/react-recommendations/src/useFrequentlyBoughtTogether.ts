import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo } from 'react';

import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type UseFrequentlyBoughtTogetherProps = {
  indexName: string;
  objectIDs: string[];
  searchClient: SearchClient;

  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
};

export function useFrequentlyBoughtTogether<TObject>(
  userProps: UseFrequentlyBoughtTogetherProps
) {
  const props: UseRecommendationsProps = useMemo(
    () => ({
      ...userProps,
      fallbackFilters: [],
      model: 'bought-together',
    }),
    [userProps]
  );

  return useRecommendations<TObject>(props);
}
