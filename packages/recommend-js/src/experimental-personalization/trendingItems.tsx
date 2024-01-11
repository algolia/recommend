/** @jsxRuntime classic */
/** @jsx h */

import { TrendingItemsProps, trendingItems as render } from '../trendingItems';
import { EnvironmentProps, HTMLTemplate } from '../types';

import { Personalization } from './types';
type Props<TObject> = TrendingItemsProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function trendingItems<TObject>({ ...props }: Props<TObject>) {
  return render({
    ...props,
    experimental: {
      personalization: {
        userToken: props.userToken,
        region: props.region,
      },
    },
  });
}
