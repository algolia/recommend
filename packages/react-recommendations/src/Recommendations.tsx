import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import PropTypes from 'prop-types';
import React from 'react';

import { ProductRecord, RecommendationModel } from './types';
import { useRecommendations } from './useRecommendations';

export type RecommendationsProps<TObject> = {
  model: RecommendationModel;
  indexName: string;
  objectID: string;
  searchClient: SearchClient;
  hitComponent: React.FunctionComponent<{ hit: TObject }>;

  analytics?: boolean;
  clickAnalytics?: boolean;
  facetFilters?: SearchOptions['facetFilters'];
  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  threshold?: number;

  children?(props: {
    recommendations: TObject[];
    children: React.ReactNode;
  }): React.ReactNode;
};

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function Recommendations<TObject extends ProductRecord>(
  props: RecommendationsProps<TObject>
) {
  const recommendations = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <div className="ais-Recommendations">
      <ol className="ais-Recommendations-list">
        {recommendations.map((recommendation) => (
          <li
            key={recommendation.objectID}
            className="ais-Recommendations-item"
          >
            <props.hitComponent hit={recommendation} />
          </li>
        ))}
      </ol>
    </div>
  );

  return render({ recommendations, children });
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
