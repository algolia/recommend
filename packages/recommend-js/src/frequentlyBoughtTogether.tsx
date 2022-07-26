/** @jsx h */
import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherVDOMProps,
  VNode,
} from '@algolia/recommend-vdom';
import htm from 'htm';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

const html = htm.bind<VNode>(createElement); // Export common

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

type Template = {
  html: HTMLTemplate;
};

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
  ...props
}: FrequentlyBoughtTogetherProps<TObject, Template> & EnvironmentProps) {
  const children = (
    <FrequentlyBoughtTogether<TObject, Template>
      {...props}
      itemComponent={(itemComponentProps) =>
        itemComponent({
          ...itemComponentProps,
          html,
        })
      }
      view={(viewProps) => (view ? view({ ...viewProps, html }) : null)}
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

  return null;
}
