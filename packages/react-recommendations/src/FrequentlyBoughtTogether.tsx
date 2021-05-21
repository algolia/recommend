import React, { useMemo } from 'react';

import { ListView } from './ListView';
import {
  ChildrenProps,
  RecommendationsComponentProps,
  RecommendationTranslations,
} from './types';
import {
  useFrequentlyBoughtTogether,
  UseFrequentlyBoughtTogetherProps,
} from './useFrequentlyBoughtTogether';
import { cx } from './utils';

export type FrequentlyBoughtTogetherProps<
  TObject
> = UseFrequentlyBoughtTogetherProps<TObject> &
  RecommendationsComponentProps<TObject>;

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);
  const translations = useMemo<Required<RecommendationTranslations>>(
    () => ({
      title: 'Frequently bought together',
      sliderLabel: 'Frequently bought together products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );
  const classNames = props.classNames ?? {};

  const render = props.children ?? defaultRender;
  const ViewComponent = props.view ?? ListView;
  const View = (viewProps: unknown) => (
    <ViewComponent
      classNames={classNames}
      items={recommendations}
      itemComponent={props.itemComponent}
      translations={translations}
      {...viewProps}
    />
  );

  return render({ classNames, recommendations, translations, View });
}

function defaultRender<TObject>(props: ChildrenProps<TObject>) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return (
    <section className={cx('auc-Recommendations', props.classNames.root)}>
      {props.translations.title && (
        <h3 className={cx('auc-Recommendations-title', props.classNames.title)}>
          {props.translations.title}
        </h3>
      )}

      <props.View />
    </section>
  );
}
