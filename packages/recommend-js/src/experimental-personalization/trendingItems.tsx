/** @jsxRuntime classic */
/** @jsx h */

import {
  isPersonalizationEnabled,
  PersonalizationProps,
} from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

import { getHTMLElement } from '../getHTMLElement';
import {
  TrendingItemsProps as TrendingItemsPropsPrimitive,
  useTrendingItems,
} from '../trendingItems';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { withHtml } from '../utils';

import { usePersonalizationFilters } from './usePersonalizationFilters';

export type GetTrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> =
  | TrendingItemsPropsPrimitive<TObject, TComponentProps>
  | (TrendingItemsPropsPrimitive<TObject, TComponentProps> &
      PersonalizationProps);

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

export type TrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetTrendingItemsProps<TObject> &
  Omit<TrendingItemsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function TrendingItems<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: TrendingItemsProps<TObject, TComponentProps>) {
  const { userToken, region } = isPersonalizationEnabled(props)
    ? props
    : { userToken: undefined, region: undefined };

  const { personalizationFilters, filterStatus } = usePersonalizationFilters({
    apiKey:
      props.recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appId: props.recommendClient.appId,
    userToken,
    region,
  });

  useEffect(() => {
    if (personalizationFilters.length > 0) {
      props.recommendClient.addAlgoliaAgent('experimental-personalization');
    }
  }, [personalizationFilters.length, props.recommendClient]);

  const params = useMemo(() => {
    const indexName = filterStatus !== 'loading' ? props.indexName : '';
    return {
      ...props,
      indexName,
      queryParameters: {
        ...props.queryParameters,
        optionalFilters: [
          ...personalizationFilters,
          ...(props.queryParameters?.optionalFilters ?? []),
        ],
      },
    };
  }, [filterStatus, props, personalizationFilters]);

  const { recommendations, status } = useTrendingItems<TObject>(params);
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
