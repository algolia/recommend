import { Personalization } from '@algolia/recommend-core';
import React from 'react';

import {
  TrendingItemsProps,
  TrendingItems as Component,
} from '../TrendingItems';

type Props<TObject> = TrendingItemsProps<TObject> & Personalization;

export function TrendingItems<TObject>(props: Props<TObject>) {
  const param = React.useRef(props);
  return <Component {...param.current} />;
}
