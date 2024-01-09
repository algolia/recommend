import { RecommendedForYouQuery } from '@algolia/recommend';
import {
  getRecommendedForYou,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendClient, useRecommendContext } from './RecommendContext';
import { UseRecommendedForYouProps } from './RecommendedForYou';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useRecommendedForYou<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
}: UseRecommendedForYouProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const { hasProvider, register } = useRecommendContext<
    GetRecommendationsResult<TObject>
  >();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const param = {
      indexName,
      threshold,
      queryParameters,
      maxRecommendations,
      fallbackParameters,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      const queries: RecommendedForYouQuery[] = [
        {
          indexName,
          threshold,
          maxRecommendations,
          queryParameters,
          fallbackParameters,
          model: 'recommended-for-you',
        },
      ];

      return register({
        key,
        getParameters() {
          return {
            queries,
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
          setResult(response);
          setStatus('idle');
        },
      });
    }

    setStatus('loading');
    getRecommendedForYou({
      ...param,
      recommendClient: client,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
    return () => {};
  }, [
    client,
    fallbackParameters,
    hasProvider,
    indexName,
    isContextClient,
    maxRecommendations,
    queryParameters,
    register,
    setStatus,
    threshold,
  ]);

  return {
    ...result,
    status,
  };
}
