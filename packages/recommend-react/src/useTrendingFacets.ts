import { RecommendationsQuery } from '@algolia/recommend';
import {
  getTrendingFacets,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import { GetRecommendationsResult } from '@algolia/recommend-core/src';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './Recommend';
import { TrendingFacetsProps } from './TrendingFacets';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export type UseTrendingFacetsProps<TObject> = TrendingFacetsProps<TObject>;

export function useTrendingFacets<TObject>({
  indexName,
  maxRecommendations,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
}: UseTrendingFacetsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  const { hasProvider, register } = useRecommendContext();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    let unregister: Function | undefined;

    const param: RecommendationsQuery = {
      model: 'trending-facets',
      indexName,
      // @ts-expect-error
      facetName,
      threshold,
      maxRecommendations,
    };

    if (!hasProvider || !isContextClient) {
      setStatus('loading');
      getTrendingFacets({
        ...param,
        recommendClient: client,
        facetName,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    } else {
      const key = JSON.stringify(param);
      unregister = register({
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
          setResult(response as GetRecommendationsResult<TObject>);
          setStatus('idle');
        },
      });
    }
    return () => {
      if (unregister) {
        unregister();
      }
    };
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
    ...result,
    status,
  };
}
