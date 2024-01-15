/** @jsxRuntime classic */
/** @jsx h */

import { Personalization } from '@algolia/recommend-core';

import {
  FrequentlyBoughtTogetherProps,
  frequentlyBoughtTogether as render,
} from '../frequentlyBoughtTogether';
import { EnvironmentProps, HTMLTemplate } from '../types';

type Props<TObject> = FrequentlyBoughtTogetherProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function frequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return render<TObject>(props);
}
