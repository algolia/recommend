import {
  RecommendClient,
  RecommendationsQuery,
  TrendingQuery,
  RecommendedForYouQuery,
} from '@algolia/recommend';

import { getPersonalizationFilters } from './personalization';
import { ProductRecord, TrendingFacetHit } from './types';
import { Personalization } from './types/Personalization';
import { mapByScoreToRecommendations, mapToRecommendations } from './utils';
import { version } from './version';

export type BatchKeyPair = {
  key: string;
  value: number;
};

export type BatchQuery<TObject> = (
  | RecommendationsQuery
  | TrendingQuery
  | RecommendedForYouQuery
) & {
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
};

export type GetBatchRecommendations<TObject> = {
  keys: BatchKeyPair[];
  queries: Array<BatchQuery<TObject>>;
  recommendClient: RecommendClient;
} & Personalization;

export type BatchRecommendations<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
  trendingFacets: TrendingFacetHit[];
};

const isTrendingFacetsQuery = <TObject>(
  query: BatchQuery<TObject>
): query is TrendingQuery => {
  return query.model === 'trending-facets';
};

const isRecommendedForYouQuery = <TObject>(
  query: BatchQuery<TObject>
): query is RecommendedForYouQuery => {
  return query.model === 'recommended-for-you';
};

export async function getBatchRecommendations<TObject>({
  keys,
  queries,
  recommendClient,
  region,
  userToken,
}: GetBatchRecommendations<TObject>): Promise<
  Record<string, BatchRecommendations<TObject>>
> {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  let _queries = queries;

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (region && userToken) {
    recommendClient.addAlgoliaAgent('personalization');
    const personalizationFilters = await getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region,
      userToken,
    });

    _queries = queries.map((query) => {
      if (
        isTrendingFacetsQuery<TObject>(query) ||
        isRecommendedForYouQuery(query)
      ) {
        return query;
      }

      return {
        ...query,
        queryParameters: {
          ...query.queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(query.queryParameters?.optionalFilters ?? []),
          ],
        },
      };
    });
  }

  const response = await recommendClient.getRecommendations<TObject>(_queries);

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

    let recommendations: Array<ProductRecord<ProductRecord<TObject>>> = [];
    let trendingFacets: TrendingFacetHit[] = [];
    if (model === 'trending-facets') {
      trendingFacets = splitResult
        .map((res) => (res.hits as unknown) as TrendingFacetHit[])
        .flat();
    } else if (model === 'trending-items') {
      recommendations = mapByScoreToRecommendations<ProductRecord<TObject>>({
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
    results[keyPair.key] = { recommendations, trendingFacets };
  });

  return results;
}
