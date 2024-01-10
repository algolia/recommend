/** @jsxRuntime classic */
/** @jsx h */
import {
  getRecommendedForYou,
  GetRecommendedForYouProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createRecommendedForYouComponent,
  RecommendedForYouProps as RecommendedForYouVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledRecommendedForYou = createRecommendedForYouComponent({
  createElement,
  Fragment,
});

function useRecommendedForYou<TObject>(
  props: GetRecommendedForYouProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getRecommendedForYou(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

type RecommendedForYouProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetRecommendedForYouProps<TObject> &
  Omit<
    RecommendedForYouVDOMProps<TObject, TComponentProps>,
    'items' | 'status'
  >;

function RecommendedForYou<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: RecommendedForYouProps<TObject, TComponentProps>) {
  const { recommendations, status } = useRecommendedForYou<TObject>(props);

  return (
    <UncontrolledRecommendedForYou
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function recommendedForYou<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: RecommendedForYouProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <RecommendedForYou<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </RecommendedForYou>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
