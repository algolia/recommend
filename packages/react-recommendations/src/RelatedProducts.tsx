import React, { useMemo } from 'react';

import { DefaultChildren } from './DefaultChildren';
import { DefaultHeader } from './DefaultHeader';
import { ListView } from './ListView';
import {
  RecommendationsComponentProps,
  RecommendationTranslations,
} from './types';
import {
  useRelatedProducts,
  UseRelatedProductsProps,
} from './useRelatedProducts';

export type RelatedProductsProps<TObject> = UseRelatedProductsProps<TObject> &
  RecommendationsComponentProps<TObject>;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations } = useRelatedProducts<TObject>(props);
  const translations = useMemo<Required<RecommendationTranslations>>(
    () => ({
      title: 'Related products',
      sliderLabel: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );
  const classNames = props.classNames ?? {};

  const children = props.children ?? DefaultChildren;
  const Header = props.headerComponent ?? DefaultHeader;
  const ViewComponent = props.view ?? ListView;
  const View = (viewProps: unknown) => (
    <ViewComponent
      classNames={classNames}
      items={recommendations}
      itemComponent={props.itemComponent}
      translations={translations}
      {...viewProps}
    />
  );

  return children({ classNames, Header, recommendations, translations, View });
}
