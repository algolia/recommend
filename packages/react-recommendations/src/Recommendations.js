import React from 'react';
import PropTypes from 'prop-types';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';

import { useRecommendations } from './useRecommendations';

function defaultRender({ children }) {
  return children;
}

export function Recommendations(props) {
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
          ),
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
  maxRecommendations: PropTypes.number,
  clickAnalytics: PropTypes.bool,
  analytics: PropTypes.bool,
  threshold: PropTypes.number,
  children: PropTypes.func,
};
