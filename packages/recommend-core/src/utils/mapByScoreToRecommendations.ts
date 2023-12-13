import { ProductRecord, TrendingFacet } from '../types';

import { sortBy } from './sortBy';

type MapToRecommendations<TObject> = {
  hits: Array<ProductRecord<TObject>>;
  maxRecommendations?: number;
};

export function mapByScoreToRecommendations<TObject>({
  hits,
  maxRecommendations,
}: MapToRecommendations<TObject>): Array<ProductRecord<TObject>> {
  // Since recommendations from multiple indices are returned, we
  // need to sort them descending based on their score.
  return sortBy<ProductRecord<TObject>>((a, b) => {
    const scoreA = a._score || 0;
    const scoreB = b._score || 0;

    return scoreA > scoreB ? -1 : 1;
  }, hits).slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}

// //////////////
type MapToTrendingFacets<TObject> = {
  hits: Array<TrendingFacet<TObject>>;
  maxRecommendations?: number;
};

export function mapByScoreToTrendingFacets<TObject>({
  hits,
  maxRecommendations,
}: MapToTrendingFacets<TObject>): Array<TrendingFacet<TObject>> {
  // Since recommendations from multiple indices are returned, we
  // need to sort them descending based on their score.
  return sortBy<TrendingFacet<TObject>>((a, b) => {
    const scoreA = a._score || 0;
    const scoreB = b._score || 0;

    return scoreA > scoreB ? -1 : 1;
  }, hits).slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
