/** @jsxRuntime classic */
/** @jsx h */
import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
  isPersonalized,
  getPersonalizationFilters,
  PersonalizationProps,
} from '@algolia/recommend-core';
import { createFrequentlyBoughtTogetherComponent } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherPropsPrimitive } from '../frequentlyBoughtTogether';
import { getHTMLElement } from '../getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from '../types';
import { useAlgoliaAgent } from '../useAlgoliaAgent';
import { useStatus } from '../useStatus';
import { withHtml } from '../utils';

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

function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
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
        return getFrequentlyBoughtTogether({
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
