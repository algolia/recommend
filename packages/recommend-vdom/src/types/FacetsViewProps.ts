import { FacetEntry } from '@algolia/recommend-core';

import { Renderer, VNode } from './Renderer';

export type FacetsViewProps<
  TItem extends FacetEntry,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent(props: { item: TItem } & Renderer): VNode;
  items: TItem[];
  translations: TTranslations;
};
