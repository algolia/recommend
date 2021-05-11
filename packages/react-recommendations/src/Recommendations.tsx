import PropTypes from 'prop-types';
import React from 'react';

import { ProductRecord, RecommendationTranslations } from './types';
import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type RecommendationsProps<TObject> = UseRecommendationsProps & {
  hitComponent: React.FunctionComponent<{ hit: TObject }>;
  children?(props: {
    recommendations: TObject[];
    children: React.ReactNode;
  }): React.ReactNode;
  translations?: Partial<RecommendationTranslations>;
};

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  return props.children;
}

export function Recommendations<TObject extends ProductRecord>(
  props: RecommendationsProps<TObject>
) {
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <div className="ais-Recommendations">
      {recommendations.length > 0 && (
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
      )}
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

  fallbackFilters: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ),
  maxRecommendations: PropTypes.number,
  searchParameters: PropTypes.object,
  threshold: PropTypes.number,

  children: PropTypes.func,
};
