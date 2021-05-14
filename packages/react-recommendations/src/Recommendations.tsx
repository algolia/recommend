import PropTypes from 'prop-types';
import React from 'react';

import { ProductBaseRecord, RecommendationTranslations } from './types';
import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type RecommendationsProps<TObject> = UseRecommendationsProps<TObject> & {
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

/**
 * @deprecated
 */
export function Recommendations<TObject extends ProductBaseRecord>(
  props: RecommendationsProps<TObject>
) {
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <div className="auc-Recommendations">
      {recommendations.length > 0 && (
        <ol className="auc-Recommendations-list">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation.objectID}
              className="auc-Recommendations-item"
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
