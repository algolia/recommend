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
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

const UncontrolledTrendingFacets = createTrendingFacetsComponent({
  createElement,
  Fragment,
});

function useTrendingFacets<TObject>(props: GetTrendingFacetsProps<TObject>) {
  const [result, setResult] = useState<GetTrendingFacetsResult<TObject>>({
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

type TrendingFacetsProps<TObject> = GetTrendingFacetsProps<TObject> &
  Omit<TrendingFacetsVDOMProps<TObject>, 'items' | 'status'>;

function TrendingFacets<TObject>(props: TrendingFacetsProps<TObject>) {
  const { recommendations, status } = useTrendingFacets<TObject>(props);

  return (
    <UncontrolledTrendingFacets
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function trendingFacets<TObject>({
  container,
  environment = window,
  ...props
}: TrendingFacetsProps<TObject> & EnvironmentProps) {
  const children = <TrendingFacets {...props} />;

  if (!container) {
    return children;
  }

  render(children, getHTMLElement(container, environment));

  return undefined;
}
