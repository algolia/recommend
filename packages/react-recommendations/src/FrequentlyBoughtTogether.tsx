import React, { useMemo } from 'react';

import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';

export type FrequentlyBoughtTogetherProps<TObject> = Omit<
  RecommendationsProps<TObject>,
  'model' | 'fallbackFilters'
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

export function FrequentlyBoughtTogether<TObject extends ProductBaseRecord>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);
  const render = props.children || defaultRender;
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Frequently bought together',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );

  const children = (
    <div className="auc-Recommendations auc-Recommendations--grid">
      {translations.title && <h3>{translations.title}</h3>}

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
