import { TrendingFacet } from '@algolia/recommend-core';

import { Renderer } from './Renderer';

export type FacetsViewProps<
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent<TComponentProps extends Record<string, unknown> = {}>(
    props: { item: TrendingFacet } & Renderer & TComponentProps
  ): JSX.Element;
  items: TrendingFacet[];
  translations: TTranslations;
};
