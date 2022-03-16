import { MultipleQueriesResponse } from '@algolia/client-search';

import { TrendingFacet } from '../types';

import { sortBy } from './sortBy';

type MapToRecommendations<TObject> = {
  response: MultipleQueriesResponse<TObject>;
  maxRecommendations?: number;
};

export function mapToTrendingFacets<TObject>({
  response,
  maxRecommendations,
}: MapToRecommendations<TObject>) {
  // Since recommendations from multiple indices are returned, we
  // need to sort them descending based on their score.
  return sortBy<TrendingFacet<TObject>>((a, b) => {
    const scoreA = a._score || 0;
    const scoreB = b._score || 0;

    return scoreA > scoreB ? -1 : 1;
  }, response.results.map((result) => result.hits).flat()).slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
