import React from 'react';

import {
  FrequentlyBoughtTogetherProps,
  FrequentlyBoughtTogether as Component,
} from '../FrequentlyBoughtTogether';

import { Personalization } from './types';

type Props<TObject> = FrequentlyBoughtTogetherProps<TObject> & Personalization;

export function FrequentlyBoughtTogether<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
