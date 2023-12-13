import { TrendingModel } from '@algolia/recommend';
import { getTrendingFacets, TrendingFacet } from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseTrendingFacetsProps } from './TrendingFacets';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export function useTrendingFacets<TObject>({
  indexName,
  maxRecommendations,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  facetName,
}: UseTrendingFacetsProps<TObject>) {
  const [recommendations, setRecommendations] = useState<
    Array<TrendingFacet<TObject>>
  >([]);
  const { status, setStatus } = useStatus('loading');

  const { hasProvider, register } = useRecommendContext();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const param = {
      model: 'trending-facets' as TrendingModel,
      indexName,
      facetName,
      threshold,
      maxRecommendations,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      return register({
        key,
        getParameters() {
          return {
            queries: [param],
            keyPair: {
              key,
              value: 1,
            },
          };
        },
        onRequest() {
          setStatus('loading');
        },
        onResult(response) {
          setRecommendations(
            response.trendingFacets as Array<TrendingFacet<TObject>>
          );
          setStatus('idle');
        },
      });
    }

    setStatus('loading');
    getTrendingFacets({
      ...param,
      recommendClient: client,
      facetName,
      transformItems: transformItemsRef.current,
    }).then((response) => {
      setRecommendations(response.recommendations);
      setStatus('idle');
    });
    return () => {};
  }, [
    indexName,
    maxRecommendations,
    client,
    setStatus,
    threshold,
    facetName,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    recommendations,
    status,
  };
}
