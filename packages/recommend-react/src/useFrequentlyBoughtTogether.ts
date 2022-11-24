import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
  InitialResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseFrequentlyBoughtTogetherProps<
  TObject
> = GetFrequentlyBoughtTogetherProps<TObject>;

export function useFrequentlyBoughtTogether<TObject>({
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  initialResult: userInitialResult,
}: UseFrequentlyBoughtTogetherProps<TObject> & {
  initialResult?: InitialResult<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialResult ? 'idle' : 'loading'
  );
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);

  const initialResult = useStableValue<GetRecommendationsResult<TObject>>({
    recommendations: [],
    ...userInitialResult,
  });
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
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
      getFrequentlyBoughtTogether({
        indexName,
        maxRecommendations,
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
    userInitialResult,
    indexName,
    maxRecommendations,
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
