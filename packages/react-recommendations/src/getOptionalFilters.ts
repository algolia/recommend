import { InternalUseRecommendationsProps, RecommendationRecord } from './types';

type GetOptionalFiltersParams = {
  fallbackFilters: InternalUseRecommendationsProps['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: InternalUseRecommendationsProps['threshold'];
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
    .reverse()
    .filter((recommendation) => recommendation.score > threshold)
    .map(
      ({ objectID, score }, i) =>
        `objectID:${objectID}<score=${Math.round(score * 100) + i}>`
    );

  return [...recommendationFilters, ...fallbackFilters];
}
