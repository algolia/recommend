/** @jsxRuntime classic */
/** @jsx h */
import { GetFrequentlyBoughtTogetherProps } from '@algolia/recommend-core';
import { FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherVDOMProps } from '@algolia/recommend-vdom';

import { frequentlyBoughtTogether as render } from '../frequentlyBoughtTogether';
import { EnvironmentProps, HTMLTemplate } from '../types';

type FrequentlyBoughtTogetherProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetFrequentlyBoughtTogetherProps<TObject> &
  Omit<
    FrequentlyBoughtTogetherVDOMProps<TObject, TComponentProps>,
    'items' | 'status'
  >;

export function frequentlyBoughtTogether<TObject>({
  experimental,
  ...props
}: FrequentlyBoughtTogetherProps<TObject, HTMLTemplate> & EnvironmentProps) {
  return render(props);
}
