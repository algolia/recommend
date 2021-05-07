import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo, useEffect, useState } from 'react';

import { RecommendationsProps } from './Recommendations';
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

function getHitsPerPage<TObject>({
  fallbackFilters,
  maxRecommendations,
  recommendations,
}: {
  fallbackFilters: InternalUseRecommendationsProps<TObject>['fallbackFilters'];
  maxRecommendations: InternalUseRecommendationsProps<TObject>['maxRecommendations'];
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

function getOptionalFilters<TObject>({
  fallbackFilters,
  recommendations,
  threshold,
}: {
  fallbackFilters: InternalUseRecommendationsProps<TObject>['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: InternalUseRecommendationsProps<TObject>['threshold'];
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

export type UseRecommendationsProps<TObject> = {
  model: RecommendationModel;
  indexName: string;
  objectID: string;
  searchClient: SearchClient;
  hitComponent: React.FunctionComponent<{ hit: TObject }>;

  analytics?: boolean;
  clickAnalytics?: boolean;
  facetFilters?: SearchOptions['facetFilters'];
  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  threshold?: number;
};

type InternalUseRecommendationsProps<TObject> = Required<
  UseRecommendationsProps<TObject>
>;

function getDefaultedProps<TObject>(
  props: RecommendationsProps<TObject>
): InternalUseRecommendationsProps<TObject> {
  return {
    analytics: false,
    clickAnalytics: false,
    facetFilters: [],
    fallbackFilters: [],
    maxRecommendations: 0,
    threshold: 0,
    ...props,
  };
}

export function useRecommendations<TObject extends ProductRecord>(
  userProps: RecommendationsProps<TObject>
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
            analytics: props.analytics,
            analyticsTags: [`alg-recommend_${props.model}`],
            clickAnalytics: props.clickAnalytics,
            enableABTest: false,
            facetFilters: props.facetFilters,
            filters: `NOT objectID:${props.objectID}`,
            ruleContexts: [`alg-recommend_${props.model}_${props.objectID}`],
            typoTolerance: false,
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
