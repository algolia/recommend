import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
  InitialResults,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useFrequentlyBoughtTogether<TObject>({
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  initialState,
}: GetFrequentlyBoughtTogetherProps<TObject> & {
  initialState?: InitialResults<TObject>;
}) {
  const initialResults = initialState ?? { recommendations: [] };
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialResults
  );
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const transformItems = useStableValue(userTransformItems);
  const queryParameters = useStableValue(userQueryParameters);

  useAlgoliaAgent({ recommendClient, initialState });

  useEffect(() => {
    if (!initialState || renderRef.current) {
      setStatus('loading');
      getFrequentlyBoughtTogether({
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
      renderRef.current = true;
    }
  }, [
    initialState,
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
