import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo, useEffect, useState } from 'react';

import {
  ProductBaseRecord,
  ProductRecord,
  RecommendationModel,
  UseRecommendationsInternalProps,
} from './types';
import {
  getHitsPerPage,
  getIndexNameFromModel,
  getOptionalFilters,
  sortBy,
  uniqBy,
} from './utils';

export type UseRecommendationsProps = {
  model: RecommendationModel;
  indexName: string;
  objectIDs: string[];
  searchClient: SearchClient;

  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
};

type UseRecommendationReturn<TObject> = {
  recommendations: TObject[];
};

function getDefaultedProps(
  props: UseRecommendationsProps
): UseRecommendationsInternalProps {
  return {
    fallbackFilters: [],
    maxRecommendations: 0,
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
    threshold: 0,
    ...props,
  };
}

export function useRecommendations<TObject extends ProductBaseRecord>(
  userProps: UseRecommendationsProps
): UseRecommendationReturn<TObject> {
  const [products, setProducts] = useState<Array<ProductRecord<TObject>>>([]);
  const props = useMemo(() => getDefaultedProps(userProps), [userProps]);

  useEffect(() => {
    props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObjects<TObject>(props.objectIDs)
      .then((response) => {
        const recommendationsList = response.results.map(
          (x) => x?.recommendations ?? []
        );

        props.searchClient
          .search<TObject>(
            recommendationsList.map((recommendations) => {
              // This computes the `hitsPerPage` value if a single `objectID`
              // was passed.
              const globalHitsPerPage = getHitsPerPage({
                fallbackFilters: props.fallbackFilters,
                maxRecommendations: props.maxRecommendations,
                recommendationsCount: recommendations.length,
              });
              // This reduces the `hitsPerPage` value to get a `globalHitsPerPage`
              // amount shared among all requests.
              const hitsPerPage =
                globalHitsPerPage > 0
                  ? Math.ceil(globalHitsPerPage / props.objectIDs.length)
                  : globalHitsPerPage;

              return {
                indexName: props.indexName,
                params: {
                  hitsPerPage,
                  optionalFilters: getOptionalFilters({
                    fallbackFilters: props.fallbackFilters,
                    recommendations,
                    threshold: props.threshold,
                  }),
                  ...props.searchParameters,
                },
              };
            })
          )
          .then((response) => {
            const hits = sortBy<ProductRecord<TObject>>(
              (a, b) => {
                const scoreA = a.__recommendScore || 0;
                const scoreB = b.__recommendScore || 0;

                return scoreA < scoreB ? 1 : -1;
              },
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

            setProducts(hits);
          });
      })
      .catch(() => {
        // The `objectID` doesn't exist, we cannot get recommendations.
        setProducts([]);
      });
  }, [props]);

  return {
    recommendations: products,
  };
}
