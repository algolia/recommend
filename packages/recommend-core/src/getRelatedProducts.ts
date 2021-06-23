import { RelatedProductsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetRelatedProductsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RelatedProductsQuery, 'objectID'>;

export function getRelatedProducts<TObject>(
  userProps: GetRelatedProductsProps<TObject>
) {
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
    .getRelatedProducts<TObject>(queries)
    .then((response) =>
      mapToRecommendations({
        response,
        maxRecommendations: props.maxRecommendations,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
