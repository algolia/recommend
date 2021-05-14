import {
  UseRecommendationsInternalProps,
  RecommendationRecord,
  ProductBaseRecord,
} from '../types';

type GetHitsPerPageParams<TObject> = {
  fallbackFilters: UseRecommendationsInternalProps<TObject>['fallbackFilters'];
  maxRecommendations: UseRecommendationsInternalProps<TObject>['maxRecommendations'];
  recommendations: RecommendationRecord[];
};

export function getHitsPerPage<TObject extends ProductBaseRecord>({
  fallbackFilters,
  maxRecommendations,
  recommendations,
}: GetHitsPerPageParams<TObject>) {
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
