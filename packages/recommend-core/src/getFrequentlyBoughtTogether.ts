import { FrequentlyBoughtTogetherQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { computePersoFilters } from './personalisation/computeScoreFilters';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetFrequentlyBoughtTogetherProps<
  TObject
> = RecommendationsProps<TObject> &
  Omit<FrequentlyBoughtTogetherQuery, 'objectID'>;

export async function getFrequentlyBoughtTogether<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  logRegion,
  userToken,
}: GetFrequentlyBoughtTogetherProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  const filters = await computePersoFilters({
    apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appID: recommendClient.appId,
    userToken,
    logRegion,
  });

  const queriesPerso = queries.map((query) => {
    return {
      ...query,
      queryParameters: {
        ...query.queryParameters,
        optionalFilters: [
          ...filters,
          ...(query.queryParameters?.optionalFilters || []),
        ],
      },
    };
  });

  const response = await recommendClient.getFrequentlyBoughtTogether<TObject>(
    queriesPerso
  );
  const hits = mapToRecommendations<ProductRecord<TObject>>({
    maxRecommendations,
    hits: response.results.map((result) => result.hits),
    nrOfObjs: objectIDs.length,
  });
  return { recommendations: transformItems(hits) };
}
