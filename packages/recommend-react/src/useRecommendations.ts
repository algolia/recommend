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
  initialState,
}: GetRecommendationsProps<TObject> & {
  initialState?: InitialResults<TObject>;
}) {
  const initialResults = initialState ?? { recommendations: [] };
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialResults
  );
  const renderRef = useRef(false);

  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const transformItems = useStableValue(userTransformItems);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient, initialState });

  useEffect(() => {
    if (!initialState || renderRef.current) {
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
      renderRef.current = true;
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
