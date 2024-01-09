/** @jsxRuntime classic */
/** @jsx h */
import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import {
  createTrendingFacetsComponent,
  TrendingComponentProps as TrendingFacetsVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledTrendingFacets = createTrendingFacetsComponent({
  createElement,
  Fragment,
});

function useTrendingFacets(props: GetTrendingFacetsProps) {
  const [result, setResult] = useState<GetTrendingFacetsResult>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getTrendingFacets(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

type TrendingFacetsProps<
  TComponentProps extends Record<string, unknown> = {}
> = GetTrendingFacetsProps &
  Omit<TrendingFacetsVDOMProps<TComponentProps>, 'items' | 'status'>;

function TrendingFacets<TComponentProps extends Record<string, unknown> = {}>(
  props: TrendingFacetsProps<TComponentProps>
) {
  const { recommendations, status } = useTrendingFacets(props);

  return (
    <UncontrolledTrendingFacets
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
export function trendingFacets({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: TrendingFacetsProps<HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <TrendingFacets<HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </TrendingFacets>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
