import { RecommendedForYouQuery, TrendingQuery } from '@algolia/recommend';
import { BatchQuery } from '@algolia/recommend-core';

export const isTrendingFacetsQuery = <TObject>(
  query: BatchQuery<TObject>
): query is TrendingQuery => {
  return query.model === 'trending-facets';
};

export const isRecommendedForYouQuery = <TObject>(
  query: BatchQuery<TObject>
): query is RecommendedForYouQuery => {
  return query.model === 'recommended-for-you';
};
