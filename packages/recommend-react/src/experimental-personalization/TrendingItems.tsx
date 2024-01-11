import React from 'react';

import {
  TrendingItemsProps,
  TrendingItems as Component,
} from '../TrendingItems';

import { Personalization } from './types';

type Props<TObject> = TrendingItemsProps<TObject> & Personalization;

export function TrendingItems<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
