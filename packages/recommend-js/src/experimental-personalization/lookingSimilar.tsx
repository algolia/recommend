/** @jsxRuntime classic */
/** @jsx h */
import {
  getLookingSimilar,
  GetLookingSimilarProps,
  getPersonalizationFilters,
  GetRecommendationsResult,
  isPersonalized,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { createLookingSimilarComponent } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from '../getHTMLElement';
import { LookingSimilarProps as LookingSimilarPropsPrimitive } from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStatus } from '../useStatus';
import { withHtml } from '../utils';

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

function useLookingSimilar<TObject>(props: GetLookingSimilarProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    if (isPersonalized(props)) {
      props.recommendClient.addAlgoliaAgent('experimental-personalization');
      getPersonalizationFilters({
        apiKey:
          props.recommendClient.transporter.queryParameters[
            'x-algolia-api-key'
          ],
        appId: props.recommendClient.appId,
        region: props.region,
        userToken: props.userToken,
      }).then((personalizationFilters) => {
        getLookingSimilar({
          ...props,
          queryParameters: {
            ...props.queryParameters,
            optionalFilters: [
              ...personalizationFilters,
              ...(props.queryParameters?.optionalFilters ?? []),
            ],
          },
        }).then((response) => {
          setResult(response);
          setStatus('idle');
        });
      });
    }

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
