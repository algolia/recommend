import { PersonalizationProps } from '@algolia/recommend-core';
import React from 'react';

import {
  LookingSimilarProps as LookingSimilarPropsPrimitive,
  LookingSimilar as LookingSimilarPrimitive,
} from '../LookingSimilar';

export type LookingSimilarProps<TObject> =
  | LookingSimilarPropsPrimitive<TObject>
  | (LookingSimilarPropsPrimitive<TObject> & PersonalizationProps);

export function LookingSimilar<TObject>(props: LookingSimilarProps<TObject>) {
  return <LookingSimilarPrimitive {...props} />;
}
