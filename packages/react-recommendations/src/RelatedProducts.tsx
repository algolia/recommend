import React, { useMemo } from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useRelatedProducts } from './useRelatedProducts';

export type RelatedProductsProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'model'
>;

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: JSX.Element;
}) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function RelatedProducts<TObject extends ProductBaseRecord>(
  props: RelatedProductsProps<TObject>
) {
  const { recommendations } = useRelatedProducts<TObject>(props);
  const render = props.children || defaultRender;
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );

  const children = (
    <section className="auc-Recommendations auc-Recommendations--grid">
      {translations.title && <h3>{translations.title}</h3>}

      {recommendations.length > 0 && (
        <div className="auc-Recommendations-container">
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
        </div>
      )}
    </section>
  );

  return render({ recommendations, children });
}
