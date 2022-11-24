import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
  InitialResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseTrendingFacetsProps<TObject> = GetTrendingFacetsProps<TObject>;

export function useTrendingFacets<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
  initialResult: userInitialResult,
}: UseTrendingFacetsProps<TObject> & {
  initialResult?: InitialResult<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialResult ? 'idle' : 'loading'
  );
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialResult = useStableValue<GetTrendingFacetsResult<TObject>>({
    recommendations: [],
    ...userInitialResult,
  });
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>(
    initialResult
  );

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const shouldFetch = !userInitialResult || !isFirstRenderRef.current;

    if (shouldFetch) {
      setStatus('loading');
      getTrendingFacets({
        recommendClient,
        transformItems: transformItemsRef.current,
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
    }
    isFirstRenderRef.current = false;
  }, [
    userInitialResult,
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
    facetName,
  ]);

  return {
    ...result,
    status,
  };
}
