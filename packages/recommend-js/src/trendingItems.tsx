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
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

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

type TrendingItemsProps<TObject> = GetTrendingItemsProps<TObject> &
  Omit<TrendingItemsVDOMProps<TObject>, 'items' | 'status'>;

function TrendingItems<TObject>(props: TrendingItemsProps<TObject>) {
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
  ...props
}: TrendingItemsProps<TObject> & EnvironmentProps) {
  const children = <TrendingItems {...props} />;

  if (!container) {
    return children;
  }

  render(children, getHTMLElement(container, environment));

  return undefined;
}
