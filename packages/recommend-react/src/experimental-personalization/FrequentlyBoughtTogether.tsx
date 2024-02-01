import { PersonalizationProps } from '@algolia/recommend-core';
import {
  createFrequentlyBoughtTogetherComponent,
  FrequentlyBoughtTogetherProps as FrequentlyBoughtTogetherVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { UseFrequentlyBoughtTogetherProps as UseFrequentlyBoughtTogetherPropsPrimitive } from '../FrequentlyBoughtTogether';

import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';

const UncontrolledFrequentlyBoughtTogether = createFrequentlyBoughtTogetherComponent(
  {
    createElement,
    Fragment,
  }
);

export type UseFrequentlyBoughtTogetherProps<TObject> =
  | UseFrequentlyBoughtTogetherPropsPrimitive<TObject>
  | (UseFrequentlyBoughtTogetherPropsPrimitive<TObject> & PersonalizationProps);

export type FrequentlyBoughtTogetherProps<
  TObject
> = UseFrequentlyBoughtTogetherProps<TObject> &
  Omit<
    FrequentlyBoughtTogetherVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function FrequentlyBoughtTogether<TObject>(
  props: FrequentlyBoughtTogetherProps<TObject>
) {
  const { recommendations, status } = useFrequentlyBoughtTogether<TObject>(
    props
  );

  return (
    <UncontrolledFrequentlyBoughtTogether
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
