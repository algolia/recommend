import React, { useMemo } from 'react';

import { DefaultView, ViewProps } from './DefaultView';
import { RecommendationsProps } from './Recommendations';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';

export type FrequentlyBoughtTogetherProps<
  TObject extends ProductBaseRecord
> = Omit<RecommendationsProps<TObject>, 'model' | 'fallbackFilters'> & {
  view?(
    props: ViewProps<
      TObject,
      RecommendationTranslations,
      Record<string, string>
    >
  ): JSX.Element;
};

export function FrequentlyBoughtTogether<TObject extends ProductBaseRecord>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);
  const translations: RecommendationTranslations &
    Record<string, string> = useMemo(
    () => ({
      title: 'Frequently bought together',
      sliderLabel: 'Frequently bought together products',
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
    <div className="auc-Recommendations">
      {translations.title && <h3>{translations.title}</h3>}

      <View
        items={recommendations}
        itemComponent={({ item }) => <props.hitComponent hit={item} />}
        translations={translations}
      />
    </div>
  );
}
