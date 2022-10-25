import {
  getTrendingItems,
  GetTrendingItemsProps,
  GetTrendingItemsResult,
  InitialResults,
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
  initialState?: InitialResults<TObject>;
}) {
  const isFirstRenderRef = useRef(false);

  const { status, setStatus } = useStatus('loading');
  const transformItems = useStableValue(userTransformItems);
  const initialState = useStableValue(userInitialState);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialResults = initialState ?? { recommendations: [] };

  const [result, setResult] = useState<GetTrendingItemsResult<TObject>>(
    initialResults
  );

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    if (!initialState || isFirstRenderRef.current) {
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
      isFirstRenderRef.current = true;
    }
  }, [
    initialState,
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
