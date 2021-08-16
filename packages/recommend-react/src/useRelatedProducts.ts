import {
  getRelatedProducts,
  GetRelatedProductsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useDeepComparedValue } from './useDeepComparedValue';
import { useStatus } from './useStatus';

export function useRelatedProducts<TObject>({
  fallbackParameters: userFallbackParameters,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  transformItems: userTransformItems,

  indexName,
  maxRecommendations,
  recommendClient,
  threshold,
}: GetRelatedProductsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  const objectIDs = useDeepComparedValue(userObjectIDs);
  const transformItems = useDeepComparedValue(userTransformItems);
  const queryParameters = useDeepComparedValue(userQueryParameters);
  const fallbackParameters = useDeepComparedValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient });

  useEffect(() => {
    setStatus('loading');
    getRelatedProducts({
      fallbackParameters,
      objectIDs,
      queryParameters,
      recommendClient,
      transformItems,

      indexName,
      maxRecommendations,
      threshold,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [
    fallbackParameters,
    objectIDs,
    queryParameters,
    recommendClient,
    transformItems,

    indexName,
    maxRecommendations,
    setStatus,
    threshold,
  ]);

  return {
    ...result,
    status,
  };
}
