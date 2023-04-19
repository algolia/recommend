import { RecommendationsQuery } from '@algolia/recommend';
import {
  getTrendingFacets,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext } from './RecommendContext';
import { TrendingFacetsProps } from './TrendingFacets';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { pickRecommendClient } from './utils/pickRecommendClient';

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

  const {
    recommendClient: recommendClientFromContext,
    hasProvider,
    register,
  } = useRecommendContext();

  const { client, isContextClient } = pickRecommendClient(
    recommendClientFromContext,
    recommendClient
  );

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
      transformItems: transformItemsRef.current,
    };
    const key = JSON.stringify(param);

    if (!hasProvider || !isContextClient) {
      setStatus('loading');
      getTrendingFacets({
        recommendClient: client,
        transformItems: transformItemsRef.current,
        indexName,
        maxRecommendations,
        threshold,
        facetName,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    } else {
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
          // @ts-ignore
          setResult(response);
          setStatus('idle');
        },
      });
    }
    return () => {
      if (unregister) {
        unregister(key);
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
