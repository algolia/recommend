/** @jsxRuntime classic */
/** @jsx h */
import {
  getPersonalizationProps,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { createLookingSimilarComponent } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

import { getHTMLElement } from '../getHTMLElement';
import {
  LookingSimilarProps as LookingSimilarPropsPrimitive,
  useLookingSimilar,
} from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { withHtml } from '../utils';

import { useBetaWarning } from './beta-warning/useBetaWarning';
import { usePersonalizationFilters } from './usePersonalizationFilters';

export type LookingSimilarProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> =
  | LookingSimilarPropsPrimitive<TObject, TComponentProps>
  | (LookingSimilarPropsPrimitive<TObject, TComponentProps> &
      PersonalizationProps);

const UncontrolledLookingSimilar = createLookingSimilarComponent({
  createElement,
  Fragment,
});

function LookingSimilar<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: LookingSimilarProps<TObject, TComponentProps>) {
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

  useBetaWarning(suppressExperimentalWarning, 'lookingSimilar');

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

  const { recommendations, status } = useLookingSimilar<TObject>(params);

  return (
    <UncontrolledLookingSimilar
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function lookingSimilar<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: LookingSimilarProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <LookingSimilar<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </LookingSimilar>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
