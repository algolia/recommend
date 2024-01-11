/** @jsxRuntime classic */
/** @jsx h */
import {
  getTrendingItems,
  GetTrendingItemsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

function useTrendingItems<TObject>(props: GetTrendingItemsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getTrendingItems(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

type TrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = Omit<GetTrendingItemsProps<TObject>, 'experimental'> &
  Omit<TrendingItemsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function TrendingItems<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: TrendingItemsProps<TObject, TComponentProps>) {
  const { recommendations, status } = useTrendingItems<TObject>(props);
  return (
    <UncontrolledTrendingItems
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function trendingItems<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: TrendingItemsProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <TrendingItems<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </TrendingItems>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
