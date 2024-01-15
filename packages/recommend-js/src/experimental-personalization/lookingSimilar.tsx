/** @jsxRuntime classic */
/** @jsx h */
import { PersonalizationProps } from '@algolia/recommend-core';

import {
  LookingSimilarProps as LookingSimilarPropsPrimitive,
  lookingSimilar as lookingSimilarPrimitive,
} from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';

export type LookingSimilarProps<TObject> = LookingSimilarPropsPrimitive<
  TObject,
  HTMLTemplate
> &
  EnvironmentProps;

export function lookingSimilar<TObject>(
  props:
    | LookingSimilarProps<TObject>
    | (LookingSimilarProps<TObject> & PersonalizationProps)
) {
  return lookingSimilarPrimitive<TObject>(props);
}
