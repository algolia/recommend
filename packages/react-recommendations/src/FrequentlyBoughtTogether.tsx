import React, { useMemo } from 'react';

import { DefaultView } from './DefaultView';
import {
  ChildrenProps,
  RecommendationsComponentProps,
  RecommendationTranslations,
} from './types';
import {
  useFrequentlyBoughtTogether,
  UseFrequentlyBoughtTogetherProps,
} from './useFrequentlyBoughtTogether';

type FrequentlyBoughtTogetherProps<TObject> = UseFrequentlyBoughtTogetherProps &
  RecommendationsComponentProps<TObject>;

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);
  const translations = useMemo<RecommendationTranslations>(
    () => ({
      title: 'Frequently bought together',
      sliderLabel: 'Frequently bought together products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );

  if (recommendations.length === 0) {
    return null;
  }

  const render = props.children ?? defaultRender;
  const ViewComponent = props.view ?? DefaultView;
  const View = (viewProps: unknown) => (
    <ViewComponent
      items={recommendations}
      itemComponent={({ item }) => <props.hitComponent hit={item} />}
      translations={translations}
      {...viewProps}
    />
  );

  return render({ recommendations, translations, View });
}

function defaultRender<TObject>(props: ChildrenProps<TObject>) {
  return (
    <section className="auc-Recommendations">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
  );
}
