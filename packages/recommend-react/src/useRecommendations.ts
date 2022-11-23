import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
  InitialRecommendations,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseRecommendationsProps<TObject> = GetRecommendationsProps<TObject>;

export function useRecommendations<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  model,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  initialRecommendations: userInitialRecommendations,
}: UseRecommendationsProps<TObject> & {
  initialRecommendations?: InitialRecommendations<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialRecommendations ? 'idle' : 'loading'
  );
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialState = useStableValue<GetRecommendationsResult<TObject>>({
    recommendations: [],
    ...userInitialRecommendations,
  });
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialState
  );

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const shouldFetch =
      !userInitialRecommendations || !isFirstRenderRef.current;

    if (shouldFetch) {
      setStatus('loading');
      getRecommendations({
        fallbackParameters,
        indexName,
        maxRecommendations,
        model,
        objectIDs,
        queryParameters,
        recommendClient,
        threshold,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    }
    isFirstRenderRef.current = false;
  }, [
    userInitialRecommendations,
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    objectIDs,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
  ]);

  return {
    ...result,
    status,
  };
}
