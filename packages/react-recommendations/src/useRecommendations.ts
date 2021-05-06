import type { SearchOptions } from '@algolia/client-search';
import { useEffect, useState } from 'react';
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

function getSearchParamsFromRecommendation(
  record: ProductRecord,
  {
    maxRecommendations = 0,
    threshold = 0,
    fallbackFilters = [],
    objectID,
    facetFilters,
  }: RecommendationsProps
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

  const recoFilters = record.recommendations
    .reverse()
    .filter((reco) => reco.score > threshold)
    .map(
      (reco, i) =>
        `objectID:${reco.objectID}<score=${Math.round(reco.score * 100) + i}>`
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
    optionalFilters: [...recoFilters, ...fallbackFilters],
  };
}

type UseRecommendationsReturn = {
  recommendations: RecommendationRecord[];
  searchParameters: SearchOptions;
};

export function useRecommendations(
  props: RecommendationsProps
): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<
    RecommendationRecord[]
  >([]);
  const [searchParameters, setSearchParameters] = useState<SearchOptions>({});

  useEffect(() => {
    props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObject<ProductRecord>(props.objectID)
      .then((record) => {
        const searchParameters = getSearchParamsFromRecommendation(
          record,
          props
        );

        setRecommendations(record.recommendations || []);
        setSearchParameters(searchParameters);
      })
      .catch(() => {
        // `getObject` can throw when there's no recommendations for the object,
        // which is not fatal.
        return {};
      });
  }, [props.model, props.indexName, props.objectID, props.searchClient]);

  return {
    recommendations,
    searchParameters,
  };
}
