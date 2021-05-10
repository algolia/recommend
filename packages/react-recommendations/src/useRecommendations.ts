import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo, useEffect, useState } from 'react';

import {
  ProductRecord,
  RecommendationModel,
  RecommendationRecord,
} from './types';

// BY RE-USING OR UPDATING THIS CODE YOU UNDERSTAND
// THAT WILL ONLY BY VALID FOR THE *BETA* VERSION OF ALGOLIA RECOMMEND
//
// ONCE FULLY RELEASE, ALGOLIA RECOMMEND WILL HAVE ITS OWN ENDPOINTS
// AND NOT ANYMORE RELY ON THE SEARCH API

function getIndexNameFromModel(model: RecommendationModel, indexName: string) {
  switch (model) {
    case 'bought-together':
      return `ai_recommend_bought-together_${indexName}`;
    case 'related-products':
      return `ai_recommend_related-products_${indexName}`;
    default:
      throw new Error(`Unknown model: ${JSON.stringify(model)}.`);
  }
}

function getHitsPerPage({
  fallbackFilters,
  maxRecommendations,
  recommendations,
}: {
  fallbackFilters: InternalUseRecommendationsProps['fallbackFilters'];
  maxRecommendations: InternalUseRecommendationsProps['maxRecommendations'];
  recommendations: RecommendationRecord[];
}) {
  const hasFallback = fallbackFilters.length > 0;

  if (recommendations.length === 0) {
    return hasFallback ? maxRecommendations : 0;
  }

  // There's recommendations and a fallback, we force to retrieve
  // `maxRecommendations` number of hits.
  if (hasFallback) {
    return maxRecommendations;
  }

  // Otherwise, cap the hits retrieved with `maxRecommendations`
  return maxRecommendations > 0
    ? Math.min(recommendations.length, maxRecommendations)
    : recommendations.length;
}

function getOptionalFilters({
  fallbackFilters,
  recommendations,
  threshold,
}: {
  fallbackFilters: InternalUseRecommendationsProps['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: InternalUseRecommendationsProps['threshold'];
}) {
  if (recommendations.length === 0) {
    return fallbackFilters;
  }

  const recommendationFilters = recommendations
    .reverse()
    .filter((recommendation) => recommendation.score > threshold)
    .map(
      ({ objectID, score }, i) =>
        `objectID:${objectID}<score=${Math.round(score * 100) + i}>`
    );

  return [...recommendationFilters, ...fallbackFilters];
}

export type UseRecommendationsProps = {
  model: RecommendationModel;
  indexName: string;
  objectID: string;
  searchClient: SearchClient;

  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
};

type InternalUseRecommendationsProps = Required<UseRecommendationsProps>;

function getDefaultedProps(
  props: UseRecommendationsProps
): InternalUseRecommendationsProps {
  return {
    fallbackFilters: [],
    maxRecommendations: 0,
    searchParameters: {
      analytics: false,
      analyticsTags: [`alg-recommend_${props.model}`],
      clickAnalytics: false,
      enableABTest: false,
      filters: `NOT objectID:${props.objectID}`,
      ruleContexts: [`alg-recommend_${props.model}_${props.objectID}`],
      typoTolerance: false,
      ...props.searchParameters,
    },
    threshold: 0,
    ...props,
  };
}

export function useRecommendations<TObject extends ProductRecord>(
  userProps: UseRecommendationsProps
): TObject[] {
  const [products, setProducts] = useState<TObject[]>([]);
  const props = useMemo(() => getDefaultedProps(userProps), [userProps]);

  useEffect(() => {
    props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObject<TObject>(props.objectID)
      .then((record) => {
        const recommendations = record.recommendations ?? [];

        props.searchClient
          .initIndex(props.indexName)
          .search<TObject>('', {
            hitsPerPage: getHitsPerPage({
              fallbackFilters: props.fallbackFilters,
              maxRecommendations: props.maxRecommendations,
              recommendations,
            }),
            optionalFilters: getOptionalFilters({
              fallbackFilters: props.fallbackFilters,
              recommendations,
              threshold: props.threshold,
            }),
            ...props.searchParameters,
          })
          .then((result) => {
            const hits = result.hits.map((hit) => {
              const match = recommendations.find(
                (x) => x.objectID === hit.objectID
              );

              return {
                ...hit,
                __indexName: props.indexName,
                __queryID: result.queryID,
                // @TODO: this is for debugging purpose and can be removed
                // before stable release.
                __recommendScore: match?.score,
              };
            });

            setProducts(hits);
          });
      })
      .catch(() => {
        // The `objectID` doesn't exist, we cannot get recommendations.
        setProducts([]);
      });
  }, [props]);

  return products;
}
