/** @jsxRuntime classic */
/** @jsx h */
import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

export function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getFrequentlyBoughtTogether(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

export type FrequentlyBoughtTogetherProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetFrequentlyBoughtTogetherProps<TObject> &
  Omit<
    FrequentlyBoughtTogetherVDOMProps<TObject, TComponentProps>,
    'items' | 'status'
  >;

function FrequentlyBoughtTogether<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: FrequentlyBoughtTogetherProps<TObject, TComponentProps>) {
  const { recommendations, status } = useFrequentlyBoughtTogether<TObject>(
    props
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
