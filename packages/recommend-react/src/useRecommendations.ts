import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
  InitialResults,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

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
  initialState: userInitialState,
}: GetRecommendationsProps<TObject> & {
  initialState?: InitialResults<TObject>;
}) {
  const isFirstRenderRef = useRef(false);

  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const transformItems = useStableValue(userTransformItems);
  const initialState = useStableValue(userInitialState);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialResults = initialState ?? { recommendations: [] };
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialResults
  );

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    if (!initialState || isFirstRenderRef.current) {
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
        transformItems,
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
    model,
    objectIDs,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
    transformItems,
  ]);

  return {
    ...result,
    status,
  };
}
