import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import PropTypes from 'prop-types';
import React from 'react';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';

import { RecommendationModel, RecommendationRecord } from './types';
import { useRecommendations } from './useRecommendations';

function defaultRender(props: { children: React.ReactChildren }) {
  return props.children;
}

export type RecommendationsProps = {
  model: RecommendationModel;
  indexName: string;
  objectID: string;
  searchClient: SearchClient;
  hitComponent: React.FunctionComponent<{ hit: RecommendationRecord }>;

  analytics?: boolean;
  clickAnalytics?: boolean;
  facetFilters?: SearchOptions['facetFilters'];
  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  threshold?: number;

  children?(props: {
    recommendations: RecommendationRecord[];
    children: React.ReactNode;
  }): React.ReactNode;
};

export function Recommendations(props: RecommendationsProps) {
  const { recommendations, searchParameters } = useRecommendations(props);
  const render = props.children || defaultRender;

  return (
    <div>
      <InstantSearch
        searchClient={props.searchClient}
        indexName={props.indexName}
      >
        <Configure
          analytics={props.analytics}
          analyticsTags={[`alg-recommend_${props.model}`]}
          clickAnalytics={props.clickAnalytics}
          enableABTest={false}
          facetFilters={searchParameters.facetFilters}
          filters={searchParameters.filters}
          hitsPerPage={searchParameters.hitsPerPage}
          optionalFilters={searchParameters.optionalFilters}
          ruleContexts={[`alg-recommend_${props.model}_${props.objectID}`]}
          typoTolerance={false}
        />
        {render({
          recommendations,
          children: (
            <Hits
              hitComponent={({ hit }) => {
                const recommendation = recommendations.find(
                  (reco) => reco.objectID === hit.objectID
                );
                hit._recommendScore = recommendation && recommendation.score;
                return props.hitComponent({ hit });
              }}
            />
          ) as any,
        })}
      </InstantSearch>
    </div>
  );
}

Recommendations.propTypes = {
  model: PropTypes.string.isRequired,
  searchClient: PropTypes.object.isRequired,
  indexName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  hitComponent: PropTypes.elementType.isRequired,

  analytics: PropTypes.bool,
  clickAnalytics: PropTypes.bool,
  facetFilters: PropTypes.arrayOf(PropTypes.string),
  fallbackFilters: PropTypes.arrayOf(PropTypes.string),
  maxRecommendations: PropTypes.number,
  threshold: PropTypes.number,

  children: PropTypes.func,
};
