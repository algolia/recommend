import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
  InitialResults,
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
  initialState: userInitialState,
}: GetTrendingFacetsProps<TObject> & {
  initialState?: InitialResults<TObject>;
}) {
  const isFirstRenderRef = useRef(false);

  const { status, setStatus } = useStatus('loading');
  const transformItems = useStableValue(userTransformItems);
  const initialState = useStableValue(userInitialState);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialResults = initialState ?? { recommendations: [] };

  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>(
    initialResults
  );

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    setStatus('loading');
    if (!initialState || isFirstRenderRef.current) {
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
  ]);

  return {
    ...result,
    status,
  };
}
