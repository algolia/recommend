import {
  getRelatedProducts,
  GetRecommendationsResult,
  getPersonalizationProps,
  getPersonalizationFilters,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStableValue } from '../useStableValue';
import { useStatus } from '../useStatus';

import { useBetaWarning } from './beta-warning/useBetaWarning';
import {
  useRecommendContext,
  useRecommendClient,
  GetParametersResult,
} from './RecommendContext';
import { UseRelatedProductsProps } from './RelatedProducts';

export function useRelatedProducts<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  ...props
}: UseRelatedProductsProps<TObject>) {
  const {
    userToken,
    region,
    suppressExperimentalWarning,
  } = getPersonalizationProps(props);

  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
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

  useBetaWarning(suppressExperimentalWarning, 'RelatedProducts');

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
      const queries: GetParametersResult<TObject>['queries'] = objectIDs.map(
        (objectID: string) => ({
          indexName,
          model: 'related-products',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
          fallbackParameters,
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
        getRelatedProducts({
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
      getRelatedProducts({
        ...param,
        recommendClient: client,
      }).then((response) => {
        setResult(response);
        setStatus('idle');
      });
    }

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
    userToken,
    region,
  ]);

  return {
    ...result,
    status,
  };
}
