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
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, html, Template } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

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

type FrequentlyBoughtTogetherProps<
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
}: FrequentlyBoughtTogetherProps<TObject, Template> & EnvironmentProps) {
  const component = (
    <FrequentlyBoughtTogether<TObject, Template>
      {...props}
      view={view ? (viewProps) => view({ ...viewProps, html }) : undefined}
      itemComponent={(itemComponentProps) =>
        itemComponent({
          ...itemComponentProps,
          html,
        })
      }
      headerComponent={
        headerComponent
          ? (headerProps) => headerComponent({ ...headerProps, html })
          : undefined
      }
      fallbackComponent={
        fallbackComponent
          ? (fallbackProps) => fallbackComponent({ ...fallbackProps, html })
          : undefined
      }
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </FrequentlyBoughtTogether>
  );

  if (!container) {
    return component;
  }

  render(component, getHTMLElement(container, environment));

  return null;
}
