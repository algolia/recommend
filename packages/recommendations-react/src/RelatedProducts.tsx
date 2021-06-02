import {
  createRelatedProductsComponent,
  RelatedProductsProps,
} from '@algolia/recommendations-vdom';
import React, { createElement, Fragment } from 'react';

import { useRelatedProducts } from './useRelatedProducts';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations } = useRelatedProducts<TObject>(props);

  return <UncontrolledRelatedProducts {...props} items={recommendations} />;
}
