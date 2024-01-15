import { Personalization } from '@algolia/recommend-core';
import React from 'react';

import { Recommend as ContextProvider } from '../Recommend';
import { RecommendProps } from '../RecommendContext';

type Props = RecommendProps & Personalization;

export function Recommend<TObject>({
  recommendClient,
  children,
  ...props
}: Props) {
  return (
    <ContextProvider<TObject> recommendClient={recommendClient} {...props}>
      {children}
    </ContextProvider>
  );
}
