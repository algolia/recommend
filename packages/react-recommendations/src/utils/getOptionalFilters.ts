import {
  UseRecommendationsInternalProps,
  RecommendationRecord,
  ProductBaseRecord,
} from '../types';

type GetOptionalFiltersParams<TObject> = {
  fallbackFilters: UseRecommendationsInternalProps<TObject>['fallbackFilters'];
  recommendations: RecommendationRecord[];
  threshold: UseRecommendationsInternalProps<TObject>['threshold'];
};

export function getOptionalFilters<TObject extends ProductBaseRecord>({
  fallbackFilters,
  recommendations,
  threshold,
}: GetOptionalFiltersParams<TObject>) {
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
