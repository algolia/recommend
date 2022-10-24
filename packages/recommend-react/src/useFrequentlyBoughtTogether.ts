import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
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
}: GetFrequentlyBoughtTogetherProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);

  const transformItemsRef = useRef(userTransformItems);
  const transformItems = transformItemsRef.current;

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
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
  }, [
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
