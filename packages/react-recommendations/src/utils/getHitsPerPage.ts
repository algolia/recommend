import { UseRecommendationsInternalProps } from '../types';

type GetHitsPerPageParams<TObject> = {
  fallbackFilters: UseRecommendationsInternalProps<TObject>['fallbackFilters'];
  maxRecommendations: UseRecommendationsInternalProps<TObject>['maxRecommendations'];
  recommendationsCount: number;
};

export function getHitsPerPage<TObject>({
  fallbackFilters,
  maxRecommendations,
  recommendationsCount,
}: GetHitsPerPageParams<TObject>) {
  const hasFallback = fallbackFilters.length > 0;

  if (recommendationsCount === 0) {
    return hasFallback ? maxRecommendations : 0;
  }

  // There's recommendations and a fallback, we force to retrieve
  // `maxRecommendations` number of hits.
  if (hasFallback) {
    return maxRecommendations;
  }

  // Otherwise, cap the hits retrieved with `maxRecommendations`
  return maxRecommendations > 0
    ? Math.min(recommendationsCount, maxRecommendations)
    : recommendationsCount;
}
