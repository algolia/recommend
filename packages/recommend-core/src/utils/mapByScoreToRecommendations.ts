/* eslint-disable dot-notation */

import { sortBy } from './sortBy';

type MapToRecommendations<THit> = {
  hits: THit[];
  maxRecommendations?: number;
};

export function mapByScoreToRecommendations<THit>({
  hits,
  maxRecommendations,
}: MapToRecommendations<THit>): THit[] {
  // Since recommendations from multiple indices are returned, we
  // need to sort them descending based on their score.
  return sortBy<THit>((a, b) => {
    const scoreA = a['_score'] ? a['_score'] : 0;
    const scoreB = b['_score'] ? b['_score'] : 0;

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
