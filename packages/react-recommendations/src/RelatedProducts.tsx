import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useRecommendations } from './useRecommendations';

export type RelatedProductsProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'model'
>;

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  // @TODO: we might always want to render something
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function RelatedProducts<TObject extends ProductBaseRecord>(
  userProps: RelatedProductsProps<TObject>
) {
  const props: RecommendationsProps<TObject> = useMemo(
    () => ({
      ...userProps,
      model: 'related-products',
    }),
    [userProps]
  );
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Related products',
      showMore: 'Show more',
      ...userProps.translations,
    }),
    [userProps.translations]
  );

  const children = (
    <section className="auc-Recommendations">
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
    </section>
  );

  return render({ recommendations, children });
}

RelatedProducts.propTypes = {
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
