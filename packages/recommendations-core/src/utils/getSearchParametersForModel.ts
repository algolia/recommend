import type { SearchOptions } from '@algolia/client-search';

import { GetRecommendationsInternalProps } from '../getRecommendations';
import { RecommendationModel, RecommendationRecord } from '../types';

type GetSearchParametersParams<TObject> = {
  fallbackFilters: GetRecommendationsInternalProps<TObject>['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: GetRecommendationsInternalProps<TObject>['threshold'];
};

function getFiltersFromRecommendations<TObject>({
  fallbackFilters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions['optionalFilters'] {
  if (recommendations.length === 0) {
    return fallbackFilters;
  }

  const recommendationFilters = recommendations
    .filter((recommendation) => recommendation.score > threshold)
    .map(({ objectID, score }) => `objectID:${objectID}<score=${score * 100}>`);

  return [...recommendationFilters, ...fallbackFilters];
}

function getSearchParametersForRelatedProducts<TObject>({
  fallbackFilters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions {
  return {
    optionalFilters: getFiltersFromRecommendations({
      fallbackFilters,
      recommendations,
      threshold,
    }),
  };
}

function getSearchParametersForFrequentlyBoughtTogether<TObject>({
  fallbackFilters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions {
  if (fallbackFilters.length === 0) {
    return {
      // We want strict recommendations for FBT when there's no fallback because
      // we cannot guess what products were bought with the reference product.
      facetFilters: [
        recommendations
          .filter((recommendation) => recommendation.score > threshold)
          .map((recommendation) => `objectID:${recommendation.objectID}`),
      ],
    };
  }

  return {
    optionalFilters: getFiltersFromRecommendations({
      fallbackFilters,
      recommendations,
      threshold,
    }),
  };
}

export function getSearchParametersForModel<TObject>(
  params: GetSearchParametersParams<TObject>
) {
  return (model: RecommendationModel) => {
    switch (model) {
      case 'bought-together':
        return getSearchParametersForFrequentlyBoughtTogether(params);
      case 'related-products':
        return getSearchParametersForRelatedProducts(params);
      default:
        throw new Error(`Unknown model: ${JSON.stringify(model)}.`);
    }
  };
}
