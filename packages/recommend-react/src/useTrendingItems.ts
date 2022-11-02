import {
  getTrendingItems,
  GetTrendingItemsProps,
  GetTrendingItemsResult,
  InitialState,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

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
  initialState: userInitialState,
}: GetTrendingItemsProps<TObject> & {
  initialState?: InitialState<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus('loading');
  const transformItems = useStableValue(userTransformItems);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialState = useStableValue<GetTrendingItemsResult<TObject>>({
    recommendations: [],
    ...userInitialState,
  });
  const [result, setResult] = useState<GetTrendingItemsResult<TObject>>(
    initialState
  );

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    const shouldFetch = !userInitialState || !isFirstRenderRef.current;

    if (shouldFetch) {
      setStatus('loading');
      getTrendingItems({
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
    } else {
      setStatus('idle');
    }

    isFirstRenderRef.current = false;
  }, [
    userInitialState,
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
