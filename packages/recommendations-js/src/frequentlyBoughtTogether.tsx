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
import { h, render, createElement, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { version } from './version';

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

  useEffect(() => {
    props.searchClient.addAlgoliaAgent('recommendations-js', version);
  }, [props.searchClient]);

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
