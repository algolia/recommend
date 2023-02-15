/** @jsx createElement */
import { createDefaultChildrenComponent } from './DefaultChildren';
import { createDefaultFallbackComponent } from './DefaultFallback';
import { createDefaultHeaderComponent } from './DefaultHeader';
import { createListViewComponent } from './ListView';
import {
  RecommendComponentProps,
  RecommendTranslations,
  Renderer,
} from './types';

export type TrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = RecommendComponentProps<TObject, TComponentProps>;

export function createTrendingItemsComponent({
  createElement,
  Fragment,
}: Renderer) {
  return function TrendingItems<TObject>(props: TrendingItemsProps<TObject>) {
    const translations: Required<RecommendTranslations> = {
      title: 'Trending items',
      sliderLabel: 'Trending items',
      ...props.translations,
    };
    const classNames = props.classNames ?? {};

    const children =
      props.children ??
      createDefaultChildrenComponent({ createElement, Fragment });
    const FallbackComponent =
      props.fallbackComponent ?? createDefaultFallbackComponent();
    const Fallback = () => (
      <FallbackComponent Fragment={Fragment} createElement={createElement} />
    );
    const Header =
      props.headerComponent ??
      createDefaultHeaderComponent({ createElement, Fragment });
    const ViewComponent =
      props.view ?? createListViewComponent({ createElement, Fragment });
    const View = (viewProps: any) => (
      <ViewComponent
        classNames={classNames}
        itemComponent={props.itemComponent}
        items={props.items}
        translations={translations}
        Fragment={Fragment}
        createElement={createElement}
        {...viewProps}
      />
    );

    return children({
      classNames,
      Fallback,
      Header,
      recommendations: props.items,
      status: props.status,
      translations,
      View,
    });
  };
}
