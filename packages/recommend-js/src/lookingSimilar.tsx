/** @jsxRuntime classic */
/** @jsx h */
import {
  getLookingSimilar,
  GetLookingSimilarProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createLookingSimilarComponent,
  LookingSimilarProps as LookingSimilarVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledLookingSimilar = createLookingSimilarComponent({
  createElement,
  Fragment,
});

function useLookingSimilar<TObject>(props: GetLookingSimilarProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getLookingSimilar(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

export type LookingSimilarProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetLookingSimilarProps<TObject> &
  Omit<LookingSimilarVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function LookingSimilar<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: LookingSimilarProps<TObject, TComponentProps>) {
  const { recommendations, status } = useLookingSimilar<TObject>(props);

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
