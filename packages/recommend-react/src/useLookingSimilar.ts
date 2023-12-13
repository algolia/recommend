import { RecommendationsQuery } from '@algolia/recommend';
import {
  getLookingSimilar,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { UseLookingSimilarProps } from './LookingSimilar';
import { useRecommendClient, useRecommendContext } from './RecommendContext';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useLookingSimilar<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
}: UseLookingSimilarProps<TObject>) {
  const [recommendations, setRecommendations] = useState<
    GetRecommendationsResult<TObject>['recommendations']
  >([]);
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
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
      objectIDs,
      queryParameters,
      threshold,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      const queries = objectIDs.map(
        (objectID: string): RecommendationsQuery => ({
          indexName,
          model: 'looking-similar',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
          fallbackParameters,
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
          setRecommendations(
            response.recommendations as GetRecommendationsResult<TObject>['recommendations']
          );
          setStatus('idle');
        },
      });
    }

    setStatus('loading');
    getLookingSimilar({
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
    objectIDs,
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
