/** @jsx h */
import {
  getFrequentlyBoughtTogether,
  GetFrequentlyBoughtTogetherProps,
  RecordWithObjectID,
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
  const [items, setItems] = useState<Array<RecordWithObjectID<TObject>>>([]);

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getFrequentlyBoughtTogether(props).then((recommendations) => {
      setItems(recommendations);
    });
  }, [props]);

  return items;
}

function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const items = useFrequentlyBoughtTogether<TObject>(props);

  return <UncontrolledFrequentlyBoughtTogether {...props} items={items} />;
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
