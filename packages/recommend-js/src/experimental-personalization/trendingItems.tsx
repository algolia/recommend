/** @jsxRuntime classic */
/** @jsx h */
import { GetTrendingItemsProps } from '@algolia/recommend-core';
import { TrendingItemsProps as TrendingItemsVDOMProps } from '@algolia/recommend-vdom';

import { trendingItems as render } from '../trendingItems';
import { EnvironmentProps, HTMLTemplate } from '../types';

type TrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetTrendingItemsProps<TObject> &
  Omit<TrendingItemsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

export function trendingItems<TObject>({
  experimental,
  ...props
}: TrendingItemsProps<TObject, HTMLTemplate> & EnvironmentProps) {
  return render(props);
}
