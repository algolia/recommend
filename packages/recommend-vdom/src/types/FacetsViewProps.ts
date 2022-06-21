import { FacetEntry } from '@algolia/recommend-core';

import { Renderer } from './Renderer';

export type FacetsViewProps<
  TItem extends FacetEntry,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent(props: { item: TItem } & Renderer): JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
