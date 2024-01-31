/** @jsxRuntime classic */
/** @jsx h */

import {
  getPersonalizationProps,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { createRelatedProductsComponent } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

import { getHTMLElement } from '../getHTMLElement';
import {
  RelatedProductsProps as RelatedProductsPropsPrimitive,
  useRelatedProducts,
} from '../relatedProducts';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { withHtml } from '../utils';

import { useBetaWarning } from './beta-warning/useBetaWarning';
import { usePersonalizationFilters } from './usePersonalizationFilters';

export type RelatedProductsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> =
  | RelatedProductsPropsPrimitive<TObject, TComponentProps>
  | (RelatedProductsPropsPrimitive<TObject, TComponentProps> &
      PersonalizationProps);

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

function RelatedProducts<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: RelatedProductsProps<TObject, TComponentProps>) {
  const {
    userToken,
    region,
    suppressExperimentalWarning,
  } = getPersonalizationProps(props);

  const { personalizationFilters, filterStatus } = usePersonalizationFilters({
    apiKey:
      props.recommendClient.transporter.queryParameters['x-algolia-api-key'],
    appId: props.recommendClient.appId,
    userToken,
    region,
  });

  useBetaWarning(suppressExperimentalWarning, 'relatedProducts');

  useEffect(() => {
    if (personalizationFilters.length > 0) {
      props.recommendClient.addAlgoliaAgent('experimental-personalization');
    }
  }, [personalizationFilters.length, props.recommendClient]);

  const params = useMemo(() => {
    const objectIDs = filterStatus !== 'loading' ? props.objectIDs : [];
    return {
      ...props,
      objectIDs,
      queryParameters: {
        ...props.queryParameters,
        optionalFilters: [
          ...personalizationFilters,
          ...(props.queryParameters?.optionalFilters ?? []),
        ],
      },
    };
  }, [filterStatus, props, personalizationFilters]);

  const { recommendations, status } = useRelatedProducts<TObject>(params);

  return (
    <UncontrolledRelatedProducts
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function relatedProducts<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: RelatedProductsProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <RelatedProducts<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </RelatedProducts>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
