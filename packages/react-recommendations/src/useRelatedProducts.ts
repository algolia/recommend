import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo } from 'react';

import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type UseRelatedProductsProps = {
  indexName: string;
  objectIDs: string[];
  searchClient: SearchClient;

  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
};

export function useRelatedProducts<TObject>(
  userProps: UseRelatedProductsProps
) {
  const props: UseRecommendationsProps = useMemo(
    () => ({
      ...userProps,
      model: 'related-products',
    }),
    [userProps]
  );

  return useRecommendations<TObject>(props);
}
