/** @jsx h */
import {
  getTrendingFacets,
  GetTrendingFacetsProps,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import {
  createTrendingFacetsComponent,
  TrendingComponentProps as TrendingFacetsVDOMProps,
  VNode,
} from '@algolia/recommend-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, html, Template } from './types';
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

type TrendingFacetsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetTrendingFacetsProps<TObject> &
  Omit<TrendingFacetsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function TrendingFacets<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: TrendingFacetsProps<TObject, TComponentProps>) {
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
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  ...props
}: TrendingFacetsProps<TObject, Template> & EnvironmentProps):
  | VNode
  | VNode[]
  | undefined {
  const children = (
    <TrendingFacets<TObject, Template>
      {...props}
      view={view ? (viewProps) => view({ ...viewProps, html }) : undefined}
      itemComponent={(itemComponentProps) =>
        itemComponent({
          ...itemComponentProps,
          html,
        })
      }
      headerComponent={(headerComponentProps) =>
        headerComponent
          ? headerComponent({ ...headerComponentProps, html })
          : null
      }
      fallbackComponent={(fallbackComponentProps) =>
        fallbackComponent
          ? fallbackComponent({
              ...fallbackComponentProps,
              html,
            })
          : null
      }
    />
  );
  if (!container) {
    return children;
  }

  render(children, getHTMLElement(container, environment));

  return undefined;
}
