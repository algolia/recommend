import {
  BatchQuery,
  getPersonalizationFilters,
  GetRecommendationsResult,
  getTrendingItems,
  isPersonalized,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStableValue } from '../useStableValue';
import { useStatus } from '../useStatus';

import {
  useRecommendContext,
  useRecommendClient,
  GetParametersResult,
} from './RecommendContext';
import { UseTrendingItemsProps } from './TrendingItems';

export function useTrendingItems<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  facetName,
  facetValue,
  transformItems: userTransformItems = (x) => x,
  ...props
}: UseTrendingItemsProps<TObject>) {
  const { userToken, region } = isPersonalized(props)
    ? props
    : { userToken: undefined, region: undefined };

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
    const param: BatchQuery<TObject> = {
      model: 'trending-items',
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      facetName,
      facetValue,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const queries: GetParametersResult<TObject>['queries'] = [
        {
          ...param,
          userToken,
          region,
        },
      ];
      const key = JSON.stringify(param);
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

    if (userToken && region) {
      client.addAlgoliaAgent('experimental-personalization');
      getPersonalizationFilters({
        apiKey: client.transporter.queryParameters['x-algolia-api-key'],
        appId: client.appId,
        region,
        userToken,
      }).then((personalizationFilters) => {
        getTrendingItems({
          ...param,
          queryParameters: {
            ...param.queryParameters,
            optionalFilters: [
              ...personalizationFilters,
              ...(param.queryParameters?.optionalFilters ?? []),
            ],
          },
          recommendClient: client,
        }).then((response) => {
          setResult(response);
          setStatus('idle');
        });
      });
    } else {
      getTrendingItems({
        ...param,
        recommendClient: client,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    }

    return () => {};
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
    userToken,
    region,
  ]);

  return {
    ...result,
    status,
  };
}
