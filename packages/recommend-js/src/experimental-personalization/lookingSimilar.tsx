/** @jsxRuntime classic */
/** @jsx h */
import { GetLookingSimilarProps } from '@algolia/recommend-core';
import { LookingSimilarProps as LookingSimilarVDOMProps } from '@algolia/recommend-vdom';

import { lookingSimilar as render } from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';

type LookingSimilarProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetLookingSimilarProps<TObject> &
  Omit<LookingSimilarVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

export function lookingSimilar<TObject>({
  experimental,
  ...props
}: LookingSimilarProps<TObject, HTMLTemplate> & EnvironmentProps) {
  return render(props);
}
