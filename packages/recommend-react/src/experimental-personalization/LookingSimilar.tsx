import { Personalization } from '@algolia/recommend-core';
import React from 'react';

import {
  LookingSimilarProps,
  LookingSimilar as Component,
} from '../LookingSimilar';

type Props<TObject> = LookingSimilarProps<TObject> & Personalization;

export function LookingSimilar<TObject>(props: Props<TObject>) {
  return <Component {...props} />;
}
