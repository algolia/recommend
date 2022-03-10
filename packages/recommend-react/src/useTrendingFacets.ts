import { GetRecommendationsResult } from '@algolia/recommend-core';
import {
  getTrendingFacets,
  GetTrendingFacetsProps,
} from '@algolia/recommend-core/src/getTrendingFacets';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useTrendingFacets<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
  facetValue,
}: GetTrendingFacetsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const transformItems = useStableValue(userTransformItems);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    setStatus('loading');
    getTrendingFacets({
      recommendClient,
      transformItems,
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      facetName,
      facetValue,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
    transformItems,
    facetName,
    facetValue,
  ]);

  return {
    ...result,
    status,
  };
}
