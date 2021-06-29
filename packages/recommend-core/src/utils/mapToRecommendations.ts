import { MultipleQueriesResponse } from '@algolia/client-search';

import { ProductRecord } from '../types';

import { sortBy } from './sortBy';
import { uniqBy } from './uniqBy';

type MapToRecommendations<TObject> = {
  response: MultipleQueriesResponse<TObject>;
  maxRecommendations?: number;
};

export function mapToRecommendations<TObject>({
  response,
  maxRecommendations,
}: MapToRecommendations<TObject>) {
  // Since recommendations from multiple indices are returned, we
  // need to sort them descending based on their score.
  return sortBy<ProductRecord<TObject>>(
    (a, b) => {
      const scoreA = a._score || 0;
      const scoreB = b._score || 0;

      return scoreA > scoreB ? -1 : 1;
    },
    // Multiple identical recommended `objectID`s can be returned b
    // the engine, so we need to remove duplicates.
    uniqBy<ProductRecord<TObject>>(
      'objectID',
      response.results.map((result) => result.hits).flat()
    )
  ).slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
