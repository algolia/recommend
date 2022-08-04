/** @jsx createElement */
import { createDefaultChildrenComponent } from './DefaultChildren';
import { createDefaultFallbackComponent } from './DefaultFallback';
import { createDefaultHeaderComponent } from './DefaultHeader';
import { createFacetsView } from './FacetsView';
import {
  RecommendTranslations,
  Renderer,
  TrendingComponentProps,
} from './types';

export function createTrendingFacetsComponent({
  createElement,
  Fragment,
}: Renderer) {
  return function TrendingFacets<TObject>(
    props: TrendingComponentProps<TObject>
  ) {
    const translations: Required<RecommendTranslations> = {
      title: 'Trending facets',
      sliderLabel: 'Trending facets',
      ...props.translations,
    };
    const classNames = props.classNames ?? {};

    const children =
      props.children ??
      createDefaultChildrenComponent({ createElement, Fragment });
    const fallbackComponent =
      props.fallbackComponent ?? createDefaultFallbackComponent();
    const Fallback = () => fallbackComponent({ Fragment, createElement });
    const Header =
      props.headerComponent ??
      createDefaultHeaderComponent({ createElement, Fragment });
    const ViewComponent =
      props.view ?? createFacetsView({ createElement, Fragment });
    const View = (viewProps: unknown) =>
      ViewComponent({
        classNames,
        itemComponent: props.itemComponent,
        items: props.items,
        translations, // @ts-ignore
        ...viewProps,
      });

    return (
      <Fragment>
        {children({
          classNames,
          Fallback,
          Header,
          recommendations: props.items,
          status: props.status,
          translations,
          View,
        })}
      </Fragment>
    );
  };
}
