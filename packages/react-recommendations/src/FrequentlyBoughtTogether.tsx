import PropTypes from 'prop-types';
import React from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductRecord } from './types';
import { useRecommendations } from './useRecommendations';

export type FrequentlyBoughtTogetherProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'model' | 'fallbackFilters'
>;

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function FrequentlyBoughtTogether<TObject extends ProductRecord>(
  userProps: FrequentlyBoughtTogetherProps<TObject>
) {
  const props: RecommendationsProps<TObject> = {
    ...userProps,
    fallbackFilters: [],
    model: 'bought-together',
  };
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <div className="ais-Recommendations">
      <h2>Frequently bought together</h2>

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

FrequentlyBoughtTogether.propTypes = {
  searchClient: PropTypes.object.isRequired,
  indexName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  hitComponent: PropTypes.elementType.isRequired,

  maxRecommendations: PropTypes.number,
  searchParameters: PropTypes.object,
  threshold: PropTypes.number,

  children: PropTypes.func,
};
