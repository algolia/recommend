import { PersonalizationProps } from '@algolia/recommend-core';
import React from 'react';

import { Recommend as ContextProvider } from '../Recommend';
import { RecommendProps as RecommendPropsPrimitive } from '../RecommendContext';

export type RecommendProps = RecommendPropsPrimitive & PersonalizationProps;

export function Recommend<TObject>({
  recommendClient,
  children,
  ...props
}: RecommendProps) {
  return (
    <ContextProvider<TObject> recommendClient={recommendClient} {...props}>
      {children}
    </ContextProvider>
  );
}
