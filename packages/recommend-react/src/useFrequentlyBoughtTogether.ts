import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
  InitialState,
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
  initialState: userInitialState,
}: UseFrequentlyBoughtTogetherProps<TObject> & {
  initialState?: InitialState<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialState ? 'idle' : 'loading'
  );
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);

  const initialState = useStableValue<GetRecommendationsResult<TObject>>({
    recommendations: [],
    ...userInitialState,
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
    const shouldFetch = !userInitialState || !isFirstRenderRef.current;

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
    userInitialState,
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
