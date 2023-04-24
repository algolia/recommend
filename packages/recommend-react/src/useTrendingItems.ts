import { RecommendationsQuery } from '@algolia/recommend';
import {
  getTrendingItems,
  GetTrendingItemsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext } from './Recommend';
import { TrendingItemsProps } from './TrendingItems';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseTrendingItemsProps<TObject> = TrendingItemsProps<TObject>;

export function useTrendingItems<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  facetName,
  facetValue,
}: UseTrendingItemsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingItemsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const {
    hasProvider,
    register,
    client,
    isContextClient,
  } = useRecommendContext(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    let unregister: Function | undefined;
    const param: RecommendationsQuery = {
      model: 'trending-items',
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      // @ts-expect-error
      facetName,
      facetValue,
    };
    const key = JSON.stringify(param);

    if (!hasProvider || !isContextClient) {
      setStatus('loading');
      getTrendingItems({
        ...param,
        recommendClient: client,
        transformItems: transformItemsRef.current,
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
          setResult(response as GetTrendingItemsResult<TObject>);
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
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    client,
    setStatus,
    threshold,
    facetName,
    facetValue,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    ...result,
    status,
  };
}
