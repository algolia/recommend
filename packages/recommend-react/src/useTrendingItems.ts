import {
  BatchQuery,
  getTrendingItems,
  GetTrendingItemsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseTrendingItemsProps } from './TrendingItems';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';
import { useAsyncError } from './utils/useAsyncError';

export function useTrendingItems<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  facetName,
  facetValue,
}: UseTrendingItemsProps<TObject>) {
  const throwAsyncError = useAsyncError();
  const [result, setResult] = useState<GetTrendingItemsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const { hasProvider, register } = useRecommendContext();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const param: BatchQuery<TObject> = {
      model: 'trending-items',
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      facetName,
      facetValue,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      return register({
        key,
        getParameters() {
          return {
            queries: [param],
            keyPair: {
              key,
              value: 1,
            },
          };
        },
        onRequest() {
          setStatus('loading');
        },
        onResult(response) {
          setResult(response as GetTrendingItemsResult<TObject>);
          setStatus('idle');
        },
        onError(error) {
          throwAsyncError(error);
        },
      });
    }

    setStatus('loading');
    getTrendingItems({
      ...param,
      recommendClient: client,
      transformItems: transformItemsRef.current,
    })
      .then((response) => {
        setResult(response);
        setStatus('idle');
      })
      .catch(throwAsyncError);
    return () => {};
  }, [
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    client,
    setStatus,
    threshold,
    facetName,
    facetValue,
    throwAsyncError,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    ...result,
    status,
  };
}
