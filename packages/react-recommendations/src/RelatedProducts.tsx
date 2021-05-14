import React, { useMemo } from 'react';

import { DefaultView, ViewProps } from './DefaultView';
import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useRelatedProducts } from './useRelatedProducts';

export type RelatedProductsProps<TObject extends ProductBaseRecord> = Omit<
  RecommendationsProps<TObject>,
  'model'
> & {
  view?(
    props: ViewProps<
      TObject,
      RecommendationTranslations,
      Record<string, string>
    >
  ): JSX.Element;
};

export function RelatedProducts<TObject extends ProductBaseRecord>(
  props: RelatedProductsProps<TObject>
) {
  const { recommendations } = useRelatedProducts<TObject>(props);
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Related products',
      sliderLabel: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );
  const View = props.view ?? DefaultView;

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="auc-Recommendations">
      {translations.title && <h3>{translations.title}</h3>}

      <View
        items={recommendations}
        itemComponent={({ item }) => <props.hitComponent hit={item} />}
        translations={translations}
      />
    </section>
  );
}
