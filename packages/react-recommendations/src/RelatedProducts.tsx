import PropTypes from 'prop-types';
import React from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductRecord } from './types';
import { useRecommendations } from './useRecommendations';

export type RelatedProductsProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'model'
>;

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  // @TODO We might always want to render something
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function RelatedProducts<TObject extends ProductRecord>(
  userProps: RelatedProductsProps<TObject>
) {
  const props: RecommendationsProps<TObject> = {
    ...userProps,
    fallbackFilters: [],
    model: 'related-products',
  };
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <section className="ais-Recommendations">
      <h2>Related products</h2>

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
