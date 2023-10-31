import type { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { personaliseRecommendations } from './personalisation';
import { ProductRecord, RecordWithObjectID } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type RecommendationsProps<TObject> = {
  /**
   * The `objectID`s of the items to get recommendations for.
   */
  objectIDs: string[];
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   *
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;

  userToken?: string;
  logRegion?: string;
};

export type GetRecommendationsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RecommendationsQuery, 'objectID'>;

export type GetRecommendationsResult<TObject> = {
  recommendations: Array<RecordWithObjectID<TObject>>;
};

export function getRecommendations<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  model,
  queryParameters,
  threshold,
  logRegion,
  userToken,
}: GetRecommendationsProps<TObject>): Promise<
  GetRecommendationsResult<TObject>
> {
  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    objectID,
    queryParameters,
    threshold,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getRecommendations<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) => {
      if (logRegion && userToken) {
        return personaliseRecommendations({
          apiKey:
            recommendClient.transporter.queryParameters['x-algolia-api-key'],
          appID: recommendClient.appId,
          logRegion,
          userToken,
          hits,
        });
      }
      return hits;
    })
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
