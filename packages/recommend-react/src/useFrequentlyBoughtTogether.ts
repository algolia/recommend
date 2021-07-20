import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export function useFrequentlyBoughtTogether<TObject>({
  indexName,
  objectIDs,
  recommendClient,
  maxRecommendations,
  queryParameters,
  threshold,
  transformItems,
}: GetFrequentlyBoughtTogetherProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const propsRef = useRef({
    recommendClient,
    queryParameters,
    transformItems,
  });
  const stringifiedObjectIDs = JSON.stringify(objectIDs);

  useAlgoliaAgent({ recommendClient: propsRef.current.recommendClient });

  useEffect(() => {
    propsRef.current = {
      recommendClient,
      queryParameters,
      transformItems,
    };
  });

  useEffect(() => {
    console.log('effect', threshold, objectIDs);

    setStatus('loading');
    getFrequentlyBoughtTogether({
      ...propsRef.current,
      indexName,
      maxRecommendations,
      threshold,
      objectIDs,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stringifiedObjectIDs,
    indexName,
    maxRecommendations,
    threshold,
    setStatus,
  ]);

  return {
    ...result,
    status,
  };
}
