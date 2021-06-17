import { GetRecommendationsInternalProps } from '../getRecommendations';

type GetHitsPerPageParams<TObject> = {
  fallbackParameters: GetRecommendationsInternalProps<TObject>['fallbackParameters'];
  maxRecommendations: GetRecommendationsInternalProps<TObject>['maxRecommendations'];
  recommendationsCount: number;
};

export function getHitsPerPage<TObject>({
  fallbackParameters,
  maxRecommendations,
  recommendationsCount,
}: GetHitsPerPageParams<TObject>) {
  const hasFallback = fallbackParameters.facetFilters.length > 0;

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
