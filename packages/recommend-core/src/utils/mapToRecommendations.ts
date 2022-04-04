import { sortBy } from './sortBy';

type MapToRecommendations<TObject> = {
  hits: Array<TObject & { _score?: number }>;
  maxRecommendations?: number;
};

export function mapToRecommendations<TObject>({
  hits,
  maxRecommendations,
}: MapToRecommendations<TObject>) {
  return hits.slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
