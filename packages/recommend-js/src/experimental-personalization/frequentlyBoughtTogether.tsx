/** @jsxRuntime classic */
/** @jsx h */
import {
  getPersonalizationProps,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { createFrequentlyBoughtTogetherComponent } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

import {
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherPropsPrimitive,
  useFrequentlyBoughtTogether,
} from '../frequentlyBoughtTogether';
import { getHTMLElement } from '../getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { withHtml } from '../utils';

import { usePersonalizationFilters } from './usePersonalizationFilters';

type FrequentlyBoughtTogetherProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> =
  | FrequentlyBoughtTogetherPropsPrimitive<TObject, TComponentProps>
  | (FrequentlyBoughtTogetherPropsPrimitive<TObject, TComponentProps> &
      PersonalizationProps);

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

function FrequentlyBoughtTogether<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: FrequentlyBoughtTogetherProps<TObject, TComponentProps>) {
  const { userToken, region } = getPersonalizationProps(props);

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

  const { recommendations, status } = useFrequentlyBoughtTogether<TObject>(
    params
  );

  return (
    <UncontrolledFrequentlyBoughtTogether
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function frequentlyBoughtTogether<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: FrequentlyBoughtTogetherProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <FrequentlyBoughtTogether<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </FrequentlyBoughtTogether>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
