import { RecommendationsQuery } from '@algolia/recommend';
import {
  getRelatedProducts,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext } from './RecommendContext';
import { RelatedProductsProps } from './RelatedProducts';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';
import { pickRecommendClient } from './utils/pickRecommendClient';

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
    const param = {
      fallbackParameters,
      indexName,
      maxRecommendations,
      objectIDs,
      queryParameters,
      threshold,
      transformItems: transformItemsRef.current,
    };

    const key = JSON.stringify(param);
    let unregister: Function | undefined;

    if (!hasProvider || !isContextClient) {
      setStatus('loading');
      getRelatedProducts({
        fallbackParameters,
        indexName,
        maxRecommendations,
        objectIDs,
        queryParameters,
        recommendClient: client,
        threshold,
        transformItems: transformItemsRef.current,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    } else {
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
