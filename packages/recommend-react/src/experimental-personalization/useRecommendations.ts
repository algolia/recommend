import {
  getPersonalizationFilters,
  getRecommendations,
  GetRecommendationsProps as GetRecommendationsPropsPrimitive,
  GetRecommendationsResult,
  getPersonalizationProps,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStableValue } from '../useStableValue';
import { useStatus } from '../useStatus';

export type UseRecommendationsProps<TObject> =
  | GetRecommendationsPropsPrimitive<TObject>
  | (GetRecommendationsPropsPrimitive<TObject> & PersonalizationProps);

export function useRecommendations<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  model,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  ...props
}: UseRecommendationsProps<TObject>) {
  const { userToken, region } = getPersonalizationProps(props);

  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    setStatus('loading');

    if (userToken && region) {
      recommendClient.addAlgoliaAgent('experimental-personalization');
      getPersonalizationFilters({
        apiKey:
          recommendClient.transporter.queryParameters['x-algolia-api-key'],
        appId: recommendClient.appId,
        region,
        userToken,
      }).then((personalizationFilters) => {
        getRecommendations({
          fallbackParameters,
          indexName,
          maxRecommendations,
          model,
          objectIDs,
          queryParameters: {
            ...queryParameters,
            optionalFilters: [
              ...personalizationFilters,
              ...(queryParameters?.optionalFilters ?? []),
            ],
          },
          recommendClient,
          threshold,
          transformItems: transformItemsRef.current,
        }).then((response) => {
          setResult(response);
          setStatus('idle');
        });
      });
    } else {
      getRecommendations({
        fallbackParameters,
        indexName,
        maxRecommendations,
        model,
        objectIDs,
        queryParameters,
        recommendClient,
        threshold,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    }
  }, [
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    objectIDs,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
    userToken,
    region,
  ]);

  return {
    ...result,
    status,
  };
}
