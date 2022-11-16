import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
  InitialState,
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
  initialState: userInitialState,
}: UseTrendingFacetsProps<TObject> & {
  initialState?: InitialState<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialState ? 'idle' : 'loading'
  );
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialState = useStableValue<GetTrendingFacetsResult<TObject>>({
    recommendations: [],
    ...userInitialState,
  });
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>(
    initialState
  );

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const shouldFetch = !userInitialState || !isFirstRenderRef.current;

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
    userInitialState,
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
