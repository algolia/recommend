import { RecommendationsQuery } from '@algolia/recommend';
import {
  getFrequentlyBoughtTogether,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { UseFrequentlyBoughtTogetherProps } from './FrequentlyBoughtTogether';
import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';
import { useAsyncError } from './utils/useAsyncError';

export function useFrequentlyBoughtTogether<TObject>({
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
}: UseFrequentlyBoughtTogetherProps<TObject>) {
  const throwAsyncError = useAsyncError();
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);

  const { hasProvider, register } = useRecommendContext();
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
      const queries = objectIDs.map(
        (objectID: string): RecommendationsQuery => ({
          indexName,
          model: 'bought-together',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
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
          setResult(response as GetRecommendationsResult<TObject>);
          setStatus('idle');
        },
        onError(error) {
          throwAsyncError(error);
        },
      });
    }

    setStatus('loading');
    getFrequentlyBoughtTogether({
      ...param,
      recommendClient: client,
    })
      .then((response) => {
        setResult(response);
        setStatus('idle');
      })
      .catch(throwAsyncError);
    return () => {};
  }, [
    indexName,
    maxRecommendations,
    objectIDs,
    queryParameters,
    client,
    setStatus,
    threshold,
    throwAsyncError,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    ...result,
    status,
  };
}
