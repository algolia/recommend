/** @jsxRuntime classic */
/** @jsx h */

import { Personalization } from '@algolia/recommend-core';

import {
  RelatedProductsProps,
  relatedProducts as render,
} from '../relatedProducts';
import { EnvironmentProps, HTMLTemplate } from '../types';

type Props<TObject> = RelatedProductsProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function relatedProducts<TObject>(props: Props<TObject>) {
  return render<TObject>(props);
}
