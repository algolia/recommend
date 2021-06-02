/** @jsx h */
import {
  getRelatedProducts,
  GetRelatedProductsProps,
  RecordWithObjectID,
} from '@algolia/recommendations-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps,
} from '@algolia/recommendations-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

function useRelatedProducts<TObject>(props: GetRelatedProductsProps<TObject>) {
  const [items, setItems] = useState<Array<RecordWithObjectID<TObject>>>([]);

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getRelatedProducts(props).then((recommendations) => {
      setItems(recommendations);
    });
  }, [props]);

  return items;
}

function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const items = useRelatedProducts<TObject>(props);

  return <UncontrolledRelatedProducts {...props} items={items} />;
}

export function relatedProducts<TObject>({
  container,
  environment = window,
  ...props
}: RelatedProductsProps<TObject> & EnvironmentProps) {
  render(
    <RelatedProducts {...props} />,
    getHTMLElement(container, environment)
  );
}
