/** @jsxRuntime classic */
/** @jsx h */

import { Personalization } from '@algolia/recommend-core';

import { TrendingItemsProps, trendingItems as render } from '../trendingItems';
import { EnvironmentProps, HTMLTemplate } from '../types';

type Props<TObject> = TrendingItemsProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function trendingItems<TObject>({ ...props }: Props<TObject>) {
  return render<TObject>(props);
}
