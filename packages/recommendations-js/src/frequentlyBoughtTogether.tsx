/** @jsx h */
import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  GetRecommendationsReturn,
} from '@algolia/recommendations-core';
import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps,
} from '@algolia/recommendations-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

function useFrequentlyBoughtTogether<TObject>(
  props: GetFrequentlyBoughtTogetherProps<TObject>
) {
  const [result, setResult] = useState<GetRecommendationsReturn<TObject>>({
    recommendations: [],
  });

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getFrequentlyBoughtTogether(props).then((response) => {
      setResult(response);
    });
  }, [props]);

  return result;
}

function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations } = useFrequentlyBoughtTogether<TObject>(props);

  return (
    <UncontrolledFrequentlyBoughtTogether {...props} items={recommendations} />
  );
}

export function frequentlyBoughtTogether<TObject>({
  container,
  environment = window,
  ...props
}: FrequentlyBoughtTogetherProps<TObject> & EnvironmentProps) {
  render(
    <FrequentlyBoughtTogether {...props} />,
    getHTMLElement(container, environment)
  );
}
