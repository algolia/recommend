import { Personalization } from '@algolia/recommend-core';
import React from 'react';

import {
  RelatedProductsProps,
  RelatedProducts as Component,
} from '../RelatedProducts';

type Props<TObject> = RelatedProductsProps<TObject> & Personalization;

export function RelatedProducts<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
