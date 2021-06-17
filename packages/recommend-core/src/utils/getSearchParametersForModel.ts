import type { SearchOptions } from '@algolia/client-search';

import { GetRecommendationsInternalProps } from '../getRecommendations';
import { RecommendModel, RecommendRecord } from '../types';

type GetSearchParametersParams<TObject> = {
  fallbackParameters: GetRecommendationsInternalProps<TObject>['fallbackParameters'];
  recommendations: RecommendRecord[];
  threshold: GetRecommendationsInternalProps<TObject>['threshold'];
};

function getFiltersFromRecommendations<TObject>({
  fallbackParameters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions['optionalFilters'] {
  if (recommendations.length === 0) {
    return fallbackParameters.facetFilters;
  }

  const recommendationFilters = recommendations
    .filter((recommendation) => recommendation.score > threshold)
    .map(({ objectID, score }) => `objectID:${objectID}<score=${score * 100}>`);

  return [...recommendationFilters, ...fallbackParameters.facetFilters];
}

function getSearchParametersForRelatedProducts<TObject>({
  fallbackParameters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions {
  return {
    optionalFilters: getFiltersFromRecommendations({
      fallbackParameters,
      recommendations,
      threshold,
    }),
  };
}

function getSearchParametersForFrequentlyBoughtTogether<TObject>({
  fallbackParameters,
  recommendations,
  threshold,
}: GetSearchParametersParams<TObject>): SearchOptions {
  if (fallbackParameters.facetFilters.length === 0) {
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
      fallbackParameters,
      recommendations,
      threshold,
    }),
  };
}

export function getSearchParametersForModel<TObject>(
  params: GetSearchParametersParams<TObject>
) {
  return (model: RecommendModel) => {
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
