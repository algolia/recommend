import { RecommendationsQuery } from '@algolia/recommend';
import {
  getRelatedProducts,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './Recommend';
import { RelatedProductsProps } from './RelatedProducts';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseRelatedProductsProps<TObject> = RelatedProductsProps<TObject>;

export function useRelatedProducts<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
}: UseRelatedProductsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
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
    };

    let unregister: Function | undefined;

    if (!hasProvider || !isContextClient) {
      setStatus('loading');
      getRelatedProducts({
        ...param,
        recommendClient: client,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    } else {
      const key = JSON.stringify(param);
      const queries = objectIDs.map(
        (objectID: string): RecommendationsQuery => ({
          indexName,
          model: 'related-products',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
          fallbackParameters,
        })
      );
      unregister = register({
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
      });
    }

    return () => {
      if (unregister) {
        unregister();
      }
    };
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
    ...result,
    status,
  };
}
