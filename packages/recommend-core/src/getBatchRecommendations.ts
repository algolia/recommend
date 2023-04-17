import { RecommendClient, RecommendationsQuery } from '@algolia/recommend';

import { GetRecommendationsResult } from './getRecommendations';
import { ProductRecord, TrendingFacet } from './types';
import { mapByScoreToRecommendations, mapToRecommendations } from './utils';
import { version } from './version';

export type BatchKeyPair = {
  key: string;
  value: number;
};

export type GetBatchRecommendations<TObject> = {
  keys: BatchKeyPair[];
  queries: RecommendationsQuery[];
  recommendClient: RecommendClient;
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
};

export async function getBatchRecommendations<TObject>({
  keys,
  queries,
  recommendClient,
}: GetBatchRecommendations<TObject>) {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  const response = await recommendClient.getRecommendations<TObject>(queries);

  let prevChunks = 0;
  let allChunks = 0;
  const results: Record<string, GetRecommendationsResult<TObject>> = {};

  keys.forEach((keyPair) => {
    const { model } = JSON.parse(keyPair.key);

    allChunks += keyPair.value;
    const { maxRecommendations } = queries[prevChunks];
    const splitResult = response?.results?.slice(prevChunks, allChunks);
    prevChunks += keyPair.value;

    let hits: any[] = [];
    if (model === 'trending-facets' || model === 'trending-items') {
      hits = mapByScoreToRecommendations<TrendingFacet<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits).flat(),
      });
    } else {
      hits = mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits),
        nrOfObjs: keyPair.value,
      });
    }
    results[keyPair.key] = { recommendations: hits };
  });

  return results;
}
