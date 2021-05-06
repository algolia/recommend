import { useEffect, useState } from 'react';

// BY RE-USING OR UPDATING THIS CODE YOU UNDERSTAND
// THAT WILL ONLY BY VALID FOR THE *BETA* VERSION OF ALGOLIA RECOMMEND
//
// ONCE FULLY RELEASE, ALGOLIA RECOMMEND WILL HAVE ITS OWN ENDPOINTS
// AND NOT ANYMORE RELY ON THE SEARCH API

function getIndexNameFromModel(model, indexName) {
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
  record,
  {
    maxRecommendations = 0,
    threshold = 0,
    fallbackFilters = [],
    objectID,
    facetFilters,
  }
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

  let hitsPerPage;

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

export function useRecommendations(props) {
  const [recommendations, setRecommendations] = useState([]);
  const [searchParameters, setSearchParameters] = useState({});

  useEffect(() => {
    return props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObject(props.objectID)
      .catch(() => {
        // `getObject` can throw when there's no recommendations for the object,
        // which is not fatal.
        return {};
      })
      .then((record) => {
        const searchParameters = getSearchParamsFromRecommendation(
          record,
          props
        );

        setRecommendations(record.recommendations || []);
        setSearchParameters(searchParameters);
      });
  }, [props.model, props.indexName, props.objectID, props.searchClient]);

  return { recommendations, searchParameters };
}
