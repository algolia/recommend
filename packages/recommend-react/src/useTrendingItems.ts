import {
  getTrendingItems,
  GetTrendingItemsProps,
  GetTrendingItemsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseTrendingItemsProps<TObject> = GetTrendingItemsProps<TObject> & {
  onError?: (error: Error) => void;
};

export function useTrendingItems<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
  facetValue,
  onError = () => {},
}: UseTrendingItemsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingItemsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    setStatus('loading');
    getTrendingItems({
      recommendClient,
      transformItems: transformItemsRef.current,
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      facetName,
      facetValue,
    })
      .then((response) => {
        setResult(response);
        setStatus('idle');
      })
      .catch(onError);
  }, [
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
    facetName,
    facetValue,
  ]);

  return {
    ...result,
    status,
  };
}
