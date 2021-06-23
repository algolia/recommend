import { FrequentlyBoughtTogetherQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetFrequentlyBoughtTogetherProps<
  TObject
> = RecommendationsProps<TObject> &
  Omit<FrequentlyBoughtTogetherQuery, 'objectID'>;

export function getFrequentlyBoughtTogether<TObject>(
  userProps: GetFrequentlyBoughtTogetherProps<TObject>
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
    .getFrequentlyBoughtTogether<TObject>(queries)
    .then((response) =>
      mapToRecommendations({
        response,
        maxRecommendations: props.maxRecommendations,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
