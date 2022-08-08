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

export type FrequentlyBoughtTogetherProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = RecommendComponentProps<TObject, TComponentProps>;

export function createFrequentlyBoughtTogetherComponent({
  createElement,
  Fragment,
}: Renderer) {
  return function FrequentlyBoughtTogether<TObject>(
    props: FrequentlyBoughtTogetherProps<TObject>
  ) {
    const translations: Required<RecommendTranslations> = {
      title: 'Frequently bought together',
      sliderLabel: 'Frequently bought together products',
      ...props.translations,
    };
    const classNames = props.classNames ?? {};
    const children =
      props.children ??
      createDefaultChildrenComponent({ createElement, Fragment });
    const fallbackComponent =
      props.fallbackComponent ?? createDefaultFallbackComponent();
    const Fallback = () => (
      <Fragment>{fallbackComponent({ createElement, Fragment })}</Fragment>
    );
    const headerComponent =
      props.headerComponent ??
      createDefaultHeaderComponent({ createElement, Fragment });
    const Header = () => (
      <Fragment>
        {headerComponent({
          classNames,
          recommendations: props.items,
          translations,
          createElement,
          Fragment,
        })}
      </Fragment>
    );
    const viewComponent =
      props.view ?? createListViewComponent({ createElement, Fragment });
    const View = (viewProps: unknown) => (
      <Fragment>
        {viewComponent({
          classNames,
          itemComponent: props.itemComponent,
          items: props.items,
          translations, // @ts-ignore
          ...viewProps,
        })}
      </Fragment>
    );

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
