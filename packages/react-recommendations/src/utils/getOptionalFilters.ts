import {
  UseRecommendationsInternalProps,
  RecommendationRecord,
} from '../types';

type GetOptionalFiltersParams = {
  fallbackFilters: UseRecommendationsInternalProps['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: UseRecommendationsInternalProps['threshold'];
};

export function getOptionalFilters({
  fallbackFilters,
  recommendations,
  threshold,
}: GetOptionalFiltersParams) {
  if (recommendations.length === 0) {
    return fallbackFilters;
  }

  const recommendationFilters = recommendations
    .filter((recommendation) => recommendation.score > threshold)
    .map(({ objectID, score }) => `objectID:${objectID}<score=${score}>`);

  return [...recommendationFilters, ...fallbackFilters];
}
