import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';

import {
  ProductRecord,
  RecommendationModel,
  RecommendationRecord,
  RecordWithObjectID,
} from './types';
import {
  getHitsPerPage,
  getIndexNameFromModel,
  getSearchParametersForModel,
  sortBy,
  uniqBy,
} from './utils';
import { version } from './version';

type RecommendRecord = RecordWithObjectID<{
  recommendations?: RecommendationRecord[];
}>;

export type GetRecommendationsProps<TObject> = {
  model: RecommendationModel;
  indexName: string;
  objectIDs: string[];
  searchClient: SearchClient;

  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
};

export type GetRecommendationsInternalProps<TObject> = Required<
  GetRecommendationsProps<TObject>
>;

export type GetRecommendationsReturn<TObject> = {
  recommendations: Array<RecordWithObjectID<TObject>>;
};

function getDefaultedProps<TObject>(
  props: GetRecommendationsProps<TObject>
): GetRecommendationsInternalProps<TObject> {
  return {
    fallbackFilters: [],
    maxRecommendations: 0,
    threshold: 0,
    transformItems: (items) => items,
    ...props,
    searchParameters: {
      analytics: false,
      analyticsTags: [`alg-recommend_${props.model}`],
      clickAnalytics: false,
      enableABTest: false,
      filters: props.objectIDs
        .map((objectID) => `NOT objectID:${objectID}`)
        .join(' AND '),
      ruleContexts: props.objectIDs.map(
        (objectID) => `alg-recommend_${props.model}_${objectID}`
      ),
      typoTolerance: false,
      ...props.searchParameters,
    },
  };
}

export function getRecommendations<TObject>(
  userProps: GetRecommendationsProps<TObject>
): Promise<GetRecommendationsReturn<TObject>> {
  const props = getDefaultedProps(userProps);

  props.searchClient.addAlgoliaAgent('recommendations-core', version);

  return props.searchClient
    .initIndex(getIndexNameFromModel(props.model, props.indexName))
    .getObjects<RecommendRecord>(props.objectIDs)
    .then((response) => {
      const recommendationsList = response.results.map(
        (result) => result?.recommendations ?? []
      );

      return props.searchClient
        .search<TObject>(
          recommendationsList.map((recommendations) => {
            // This computes the `hitsPerPage` value as if a single `objectID`
            // was passed.
            const globalHitsPerPage = getHitsPerPage({
              fallbackFilters: props.fallbackFilters,
              maxRecommendations: props.maxRecommendations,
              recommendationsCount: recommendations.length,
            });
            // This reduces the `globalHitsPerPage` value to get a `hitsPerPage`
            // that is divided among all requests.
            const hitsPerPage =
              globalHitsPerPage > 0
                ? Math.ceil(globalHitsPerPage / props.objectIDs.length)
                : globalHitsPerPage;
            const searchParametersForModel = getSearchParametersForModel({
              fallbackFilters: props.fallbackFilters,
              recommendations,
              threshold: props.threshold,
            })(props.model);

            return {
              indexName: props.indexName,
              params: {
                hitsPerPage,
                ...searchParametersForModel,
                ...props.searchParameters,
                facetFilters: ((searchParametersForModel.facetFilters ||
                  []) as string[]).concat(
                  (props.searchParameters.facetFilters || []) as string[]
                ),
                optionalFilters: ((searchParametersForModel.optionalFilters ||
                  []) as string[]).concat(
                  (props.searchParameters.optionalFilters || []) as string[]
                ),
              },
            };
          })
        )
        .then((response) => {
          const hits =
            // Since recommendations from multiple indices are returned, we
            // need to sort them descending based on their score.
            sortBy<ProductRecord<TObject>>(
              (a, b) => {
                const scoreA = a.__recommendScore || 0;
                const scoreB = b.__recommendScore || 0;

                return scoreA < scoreB ? 1 : -1;
              },
              // Multiple identical recommended `objectID`s can be returned b
              // the engine, so we need to remove duplicates.
              uniqBy<ProductRecord<TObject>>(
                'objectID',
                response.results.flatMap((result) =>
                  result.hits.map((hit, index) => {
                    const match = recommendationsList
                      .flat()
                      .find((x) => x.objectID === hit.objectID);

                    return {
                      ...hit,
                      __indexName: props.indexName,
                      __queryID: result.queryID,
                      __position: index + 1,
                      __recommendScore: match?.score ?? null,
                    };
                  })
                )
              )
            ).slice(
              0,
              // We cap the number of recommendations because the previously
              // computed `hitsPerPage` was an approximation due to `Math.ceil`.
              props.maxRecommendations > 0
                ? props.maxRecommendations
                : undefined
            );

          return {
            recommendations: props.transformItems(hits),
          };
        });
    })
    .catch(() => {
      // The `objectID` doesn't exist, we cannot get recommendations.
      return {
        recommendations: [],
      };
    });
}
