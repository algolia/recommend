import {
  getRelatedProducts,
  GetRelatedProductsProps,
  GetRecommendationsResult,
  InitialResults,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useRelatedProducts<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  initialState,
}: GetRelatedProductsProps<TObject> & {
  initialState?: InitialResults<TObject>;
}) {
  const initialResults = initialState ?? { recommendations: [] };

  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialResults
  );
  const isFirstRenderRef = useRef(false);

  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const transformItems = useStableValue(userTransformItems);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient, initialState });

  useEffect(() => {
    if (!initialState || isFirstRenderRef.current) {
      setStatus('loading');
      getRelatedProducts({
        fallbackParameters,
        indexName,
        maxRecommendations,
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
