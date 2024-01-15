/** @jsxRuntime classic */
/** @jsx h */
import { Personalization } from '@algolia/recommend-core';

import {
  LookingSimilarProps,
  lookingSimilar as render,
} from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';

type Props<TObject> = LookingSimilarProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function lookingSimilar<TObject>(props: Props<TObject>) {
  return render<TObject>(props);
}
