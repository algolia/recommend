import {
  getFrequentlyBoughtTogether,
  getPersonalizationFilters,
  GetRecommendationsResult,
  isPersonalized,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStableValue } from '../useStableValue';
import { useStatus } from '../useStatus';

import { UseFrequentlyBoughtTogetherProps } from './FrequentlyBoughtTogether';
import {
  useRecommendContext,
  useRecommendClient,
  GetParametersResult,
} from './RecommendContext';

export function useFrequentlyBoughtTogether<TObject>({
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  ...props
}: UseFrequentlyBoughtTogetherProps<TObject>) {
  const { userToken, region } = isPersonalized(props)
    ? props
    : { userToken: undefined, region: undefined };

  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);

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
      maxRecommendations,
      objectIDs,
      queryParameters,
      threshold,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      const queries: GetParametersResult<TObject>['queries'] = objectIDs.map(
        (objectID: string) => ({
          indexName,
          model: 'bought-together',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
          userToken,
          region,
        })
      );
      return register({
        key,
        getParameters() {
          return {
            queries,
            keyPair: {
              key,
              value: objectIDs.length,
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
        getFrequentlyBoughtTogether({
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
      getFrequentlyBoughtTogether({
        ...param,
        recommendClient: client,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    }

    return () => {};
  }, [
    indexName,
    maxRecommendations,
    objectIDs,
    queryParameters,
    client,
    setStatus,
    threshold,
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
