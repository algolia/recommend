import { UseRecommendationsInternalProps } from '../types';

type GetHitsPerPageParams = {
  fallbackFilters: UseRecommendationsInternalProps['fallbackFilters'];
  maxRecommendations: UseRecommendationsInternalProps['maxRecommendations'];
  recommendationsCount: number;
};

export function getHitsPerPage({
  fallbackFilters,
  maxRecommendations,
  recommendationsCount,
}: GetHitsPerPageParams) {
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
