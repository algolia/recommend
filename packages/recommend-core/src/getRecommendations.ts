import type { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { getPersonalizationFilters } from './personalization';
import { ProductRecord, RecordWithObjectID } from './types';
import { Experimental } from './types/Experimental';
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

  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
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
  experimental,
}: GetRecommendationsProps<TObject>): Promise<
  GetRecommendationsResult<TObject>
> {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (
    experimental?.personalization?.enabled &&
    experimental?.personalization?.region
  ) {
    return getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region: experimental.personalization.region,
      userToken: experimental.personalization.userToken,
      cache: experimental.personalization.cache,
    }).then((personalizationFilters) => {
      const queries = objectIDs.map((objectID) => ({
        fallbackParameters,
        indexName,
        maxRecommendations,
        model,
        objectID,
        queryParameters: {
          ...queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(queryParameters?.optionalFilters ?? []),
          ],
        },
        threshold,
      }));

      return recommendClient
        .getRecommendations<TObject>(queries)
        .then((response) =>
          mapToRecommendations<ProductRecord<TObject>>({
            maxRecommendations,
            hits: response.results.map((result) => result.hits),
            nrOfObjs: objectIDs.length,
          })
        )
        .then((hits) => ({ recommendations: transformItems(hits) }));
    });
  }

  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    objectID,
    queryParameters,
    threshold,
  }));

  return recommendClient
    .getRecommendations<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
