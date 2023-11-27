import {
  RecommendClient,
  RecommendationsQuery,
  TrendingQuery,
} from '@algolia/recommend';

import { ProductRecord, TrendingFacet } from './types';
import { mapByScoreToRecommendations, mapToRecommendations } from './utils';
import { version } from './version';

export type BatchKeyPair = {
  key: string;
  value: number;
};

export type BatchQuery<TObject> = (RecommendationsQuery | TrendingQuery) & {
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
} & {
  readonly logRegion?: string;
  readonly userToken?: string;
  readonly personalisationOption?: 'disabled' | 're-rank' | 'filters';
  readonly personalisationVersion?: 'v1' | 'neural';
};

export type GetBatchRecommendations<TObject> = {
  keys: BatchKeyPair[];
  queries: Array<BatchQuery<TObject>>;
  recommendClient: RecommendClient;
};

export type BatchRecommendations<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
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
    const { maxRecommendations, transformItems = (x) => x } = queries[
      prevChunks
    ];
    const splitResult = response?.results?.slice(prevChunks, allChunks);
    prevChunks += keyPair.value;

    let recommendations: Array<ProductRecord<ProductRecord<TObject>>>;

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
    recommendations = transformItems(recommendations);
    results[keyPair.key] = { recommendations };
  });

  return results;
}
