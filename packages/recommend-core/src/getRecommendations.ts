import type { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import {
  computePersonalisationFilters,
  personaliseRecommendations,
} from './personalisation';
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
  personalisationOption?: 'disabled' | 're-rank' | 'filters';
  personalisationVersion?: 'v1' | 'neural';
};

export type GetRecommendationsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RecommendationsQuery, 'objectID'>;

export type GetRecommendationsResult<TObject> = {
  recommendations: Array<RecordWithObjectID<TObject>>;
};

export async function getRecommendations<TObject>({
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
  personalisationOption = 'disabled',
  personalisationVersion = 'v1',
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

  const filters = await computePersonalisationFilters({
    personalisationVersion,
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
    enabled: personalisationOption === 'filters',
    indexName,
  });

  const queriesPerso = queries.map((query) => {
    return {
      ...query,
      queryParameters: {
        ...query.queryParameters,
        userToken,
        getRankingInfo: true,
        enablePersonalization: personalisationOption === 'filters',
        optionalFilters: [
          ...filters,
          ...(query.queryParameters?.optionalFilters || []),
        ],
      },
    };
  });

  const response = await recommendClient.getRelatedProducts<TObject>(
    personalisationOption === 'filters' ? queriesPerso : queries
  );
  const hits = mapToRecommendations<ProductRecord<TObject>>({
    maxRecommendations,
    hits: response.results.map((result) => result.hits),
    nrOfObjs: objectIDs.length,
  });

  if (logRegion && userToken && personalisationOption === 're-rank') {
    const _hits = await personaliseRecommendations({
      personalisationVersion,
      indexName,
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appID: recommendClient.appId,
      logRegion,
      userToken,
      hits,
    });
    return { recommendations: transformItems(_hits) };
  }
  return { recommendations: transformItems(hits) };
}
