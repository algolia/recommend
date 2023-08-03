import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export type UseTrendingFacetsProps<
  TObject
> = GetTrendingFacetsProps<TObject> & {
  onError?: (error: Error) => void;
};

export function useTrendingFacets<TObject>({
  indexName,
  maxRecommendations,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
  onError = () => {},
}: UseTrendingFacetsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    setStatus('loading');
    getTrendingFacets({
      recommendClient,
      transformItems: transformItemsRef.current,
      indexName,
      maxRecommendations,
      threshold,
      facetName,
    })
      .then((response) => {
        setResult(response);
        setStatus('idle');
      })
      .catch(onError);
  }, [
    indexName,
    maxRecommendations,
    recommendClient,
    setStatus,
    threshold,
    facetName,
  ]);

  return {
    ...result,
    status,
  };
}
