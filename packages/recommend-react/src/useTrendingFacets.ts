import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

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
}: GetTrendingFacetsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const transformItemsRef = useRef(userTransformItems);
  const transformItems = transformItemsRef.current;

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
  ]);

  return {
    ...result,
    status,
  };
}
