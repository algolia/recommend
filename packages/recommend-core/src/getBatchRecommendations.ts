import { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { ProductRecord, RecordWithObjectID, TrendingFacet } from './types';
import { mapByScoreToRecommendations, mapToRecommendations } from './utils';
import { version } from './version';

export type BatchKeyPair = {
  key: string;
  value: number;
};

type Recommendation<TObject> =
  | RecordWithObjectID
  | TrendingFacet<TObject>
  | ProductRecord<TObject>;

export type BatchQuery<TObject> = RecommendationsQuery & {
  transformItems?: (
    items: Array<Recommendation<TObject>>
  ) => Array<Recommendation<TObject>>;
};

export type GetBatchRecommendations<TObject> = {
  keys: BatchKeyPair[];
  queries: Array<BatchQuery<TObject>>;
  recommendClient: RecommendClient;
};

export type BatchRecommendations<TObject> = {
  recommendations: Array<Recommendation<TObject>>;
};

export async function getBatchRecommendations<TObject>({
  keys,
  queries,
  recommendClient,
}: GetBatchRecommendations<TObject>): Promise<
  Record<string, BatchRecommendations<TObject>>
> {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  const response = await recommendClient.getRecommendations<TObject>(queries);

  let prevChunks = 0;
  let allChunks = 0;

  const results: Record<string, BatchRecommendations<TObject>> = {};

  keys.forEach((keyPair) => {
    const { model } = JSON.parse(keyPair.key);

    allChunks += keyPair.value;
    const { maxRecommendations, transformItems } = queries[prevChunks];
    const splitResult = response?.results?.slice(prevChunks, allChunks);
    prevChunks += keyPair.value;

    let recommendations: BatchRecommendations<TObject>['recommendations'];

    if (model === 'trending-facets' || model === 'trending-items') {
      recommendations = mapByScoreToRecommendations<TrendingFacet<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits).flat(),
      });
    } else {
      recommendations = mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits),
        nrOfObjs: keyPair.value,
      });
    }
    if (transformItems) {
      recommendations = transformItems(recommendations);
    }
    results[keyPair.key] = { recommendations };
  });

  return results;
}
