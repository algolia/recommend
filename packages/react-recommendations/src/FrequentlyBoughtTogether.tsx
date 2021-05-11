import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
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

export function FrequentlyBoughtTogether<TObject extends ProductBaseRecord>(
  userProps: FrequentlyBoughtTogetherProps<TObject>
) {
  const props: RecommendationsProps<TObject> = useMemo(
    () => ({
      ...userProps,
      fallbackFilters: [],
      model: 'bought-together',
    }),
    [userProps]
  );
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Frequently bought together',
      showMore: 'Show more',
      ...userProps.translations,
    }),
    [userProps.translations]
  );

  const children = (
    <div className="auc-Recommendations">
      {translations.title && <h2>{translations.title}</h2>}

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
