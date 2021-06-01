/** @jsx createElement */
import { GetFrequentlyBoughtTogetherProps } from '@algolia/recommendations-core';

import { createDefaultChildrenComponent } from './DefaultChildren';
import { createDefaultFallbackComponent } from './DefaultFallback';
import { createDefaultHeaderComponent } from './DefaultHeader';
import { createListViewComponent } from './ListView';
import {
  RecommendationsComponentProps,
  RecommendationTranslations,
  Renderer,
} from './types';

export type FrequentlyBoughtTogetherProps<
  TObject
> = GetFrequentlyBoughtTogetherProps<TObject> &
  RecommendationsComponentProps<TObject>;

export function createFrequentlyBoughtTogetherComponent({
  createElement,
  Fragment,
}: Renderer) {
  return function FrequentlyBoughtTogether<TObject>(
    props: FrequentlyBoughtTogetherProps<TObject>
  ) {
    const translations: Required<RecommendationTranslations> = {
      title: 'Related products',
      sliderLabel: 'Frequently bought together products',
      showMore: 'Show more',
      ...props.translations,
    };
    const classNames = props.classNames ?? {};

    const children =
      props.children ??
      createDefaultChildrenComponent({ createElement, Fragment });
    const Fallback =
      props.fallbackComponent ?? createDefaultFallbackComponent();
    const Header =
      props.headerComponent ??
      createDefaultHeaderComponent({ createElement, Fragment });
    const ViewComponent =
      props.view ?? createListViewComponent({ createElement, Fragment });
    const View = (viewProps: unknown) => (
      <ViewComponent
        classNames={classNames}
        itemComponent={props.itemComponent}
        items={props.items}
        translations={translations}
        {...viewProps}
      />
    );

    return children({
      classNames,
      Fallback,
      Header,
      recommendations: props.items,
      translations,
      View,
    });
  };
}
