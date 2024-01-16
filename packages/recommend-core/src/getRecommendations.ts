import type { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { getPersonalizationFilters, isPersonalized } from './personalization';
import { ProductRecord, RecordWithObjectID } from './types';
import { PersonalizationProps } from './types/PersonalizationProps';
import { mapToRecommendations } from './utils';
import { version } from './version';

type _RecommendationsProps<TObject> = {
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
};

export type RecommendationsProps<TObject> =
  | _RecommendationsProps<TObject>
  | (_RecommendationsProps<TObject> & PersonalizationProps);

export type GetRecommendationsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RecommendationsQuery, 'objectID'>;

export type GetRecommendationsResult<TObject> = {
  recommendations: Array<RecordWithObjectID<TObject>>;
};

export function getRecommendations<TObject>(
  params: GetRecommendationsProps<TObject>
): Promise<GetRecommendationsResult<TObject>> {
  const {
    objectIDs,
    recommendClient,
    transformItems = (x) => x,
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    queryParameters,
    threshold,
  } = params;

  recommendClient.addAlgoliaAgent('recommend-core', version);

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (isPersonalized(params) && params.region && params.userToken) {
    recommendClient.addAlgoliaAgent('experimental-personalization');
    return getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region: params.region,
      userToken: params.userToken,
      cache: params.personalizationCache,
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
