import { useEffect, useState } from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductRecord, RecommendationModel } from './types';

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

function getSearchParamsFromRecommendation<TObject extends ProductRecord>(
  record: TObject,
  {
    maxRecommendations = 0,
    threshold = 0,
    fallbackFilters = [],
    objectID,
    facetFilters,
  }: RecommendationsProps<TObject>
) {
  const hasFallback = fallbackFilters.length > 0;

  if (!record.recommendations) {
    return {
      facetFilters,
      filters: `NOT objectID:${objectID}`,
      hitsPerPage: hasFallback ? maxRecommendations : 0,
      optionalFilters: fallbackFilters,
    };
  }

  const recommendationFilters = record.recommendations
    .reverse()
    .filter((recommendation) => recommendation.score > threshold)
    .map(
      ({ objectID, score }, i) =>
        `objectID:${objectID}<score=${Math.round(score * 100) + i}>`
    );

  let hitsPerPage: number;

  // There's recommendations and a fallback, we force to retrieve
  // `maxRecommendations` number of hits.
  if (hasFallback) {
    hitsPerPage = maxRecommendations;
  } else {
    // Otherwise, cap the hits retrieved with `maxRecommendations`
    if (maxRecommendations > 0) {
      hitsPerPage = Math.min(record.recommendations.length, maxRecommendations);
    } else {
      hitsPerPage = record.recommendations.length;
    }
  }

  return {
    facetFilters,
    filters: `NOT objectID:${objectID}`,
    hitsPerPage,
    optionalFilters: [...recommendationFilters, ...fallbackFilters],
  };
}

export function useRecommendations<TObject extends ProductRecord>(
  props: RecommendationsProps<TObject>
): TObject[] {
  const [products, setProducts] = useState<TObject[]>([]);

  useEffect(() => {
    props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObject<TObject>(props.objectID)
      .then((record) => {
        const searchParameters = getSearchParamsFromRecommendation(
          record,
          props
        );
        const recommendations = record.recommendations || [];

        props.searchClient
          .initIndex(props.indexName)
          .search<TObject>('', {
            analytics: props.analytics,
            analyticsTags: [`alg-recommend_${props.model}`],
            clickAnalytics: props.clickAnalytics,
            enableABTest: false,
            ruleContexts: [`alg-recommend_${props.model}_${props.objectID}`],
            typoTolerance: false,
            ...searchParameters,
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
