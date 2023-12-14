import { RecommendationsQuery } from '@algolia/recommend';
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
  const [recommendations, setRecommendations] = useState<
    GetRecommendationsResult<TObject>['recommendations']
  >([]);
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const { hasProvider, register } = useRecommendContext();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const param = {
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      const queries: RecommendationsQuery[] = [
        {
          indexName,
          model: 'recommended-for-you',
          objectID: '',
          threshold,
          maxRecommendations,
          queryParameters,
          fallbackParameters,
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
          setRecommendations(
            response.recommendations as GetRecommendationsResult<TObject>['recommendations']
          );
          setStatus('idle');
        },
      });
    }

    setStatus('loading');
    getRecommendedForYou({
      ...param,
      recommendClient: client,
    }).then((response) => {
      setRecommendations(response.recommendations);
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
    recommendations,
    status,
  };
}
