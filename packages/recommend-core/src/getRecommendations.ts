import type { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { ProductRecord, RecordWithObjectID } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type RecommendationsProps<TObject> = {
  objectIDs: string[];
  recommendClient: RecommendClient;
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
};

export type GetRecommendationsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RecommendationsQuery, 'objectID'>;

export type GetRecommendationsResult<TObject> = {
  recommendations: Array<RecordWithObjectID<TObject>>;
};

export function getRecommendations<TObject>(
  userProps: GetRecommendationsProps<TObject>
): Promise<GetRecommendationsResult<TObject>> {
  const {
    objectIDs,
    recommendClient,
    transformItems = (x) => x,
    ...props
  } = userProps;
  const queries = objectIDs.map((objectID) => ({
    ...props,
    objectID,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getRecommendations<TObject>(queries)
    .then((response) =>
      mapToRecommendations({
        response,
        maxRecommendations: props.maxRecommendations,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
