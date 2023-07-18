import { RelatedProductsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { version } from './version';

export type GetLookingSimilarProps<TObject> = RecommendationsProps<TObject> &
  Omit<RelatedProductsQuery, 'objectID'>;

export function getLookingSimilar<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
}: GetLookingSimilarProps<TObject>) {
  // @ts-ignore
  const model = 'looking-similar';

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

  return (
    recommendClient
      // @ts-ignore
      .getRecommendations<TObject>(queries)
      .then((response) =>
        mapToRecommendations<ProductRecord<TObject>>({
          maxRecommendations,
          hits: response.results.map((result) => result.hits),
          nrOfObjs: objectIDs.length,
        })
      )
      .then((hits) => ({ recommendations: transformItems(hits) }))
  );
}
