import React, { useCallback, useMemo } from 'react';

import { DefaultChildren } from './DefaultChildren';
import { DefaultFallback } from './DefaultFallback';
import { DefaultHeader } from './DefaultHeader';
import { ListView } from './ListView';
import {
  RecommendationsComponentProps,
  RecommendationTranslations,
} from './types';
import {
  useFrequentlyBoughtTogether,
  UseFrequentlyBoughtTogetherProps,
} from './useFrequentlyBoughtTogether';

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

  const children = props.children ?? DefaultChildren;
  const Fallback = props.fallbackComponent ?? DefaultFallback;
  const Header = props.headerComponent ?? DefaultHeader;
  const ViewComponent = props.view ?? ListView;
  const View = (viewProps: unknown) => (
    <ViewComponent
      classNames={classNames}
      itemComponent={props.itemComponent}
      items={recommendations}
      translations={translations}
      {...viewProps}
    />
  );

  return children({
    classNames,
    Fallback,
    Header,
    recommendations,
    translations,
    View,
  });
}
