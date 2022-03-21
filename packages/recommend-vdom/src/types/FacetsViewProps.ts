import { FacetEntry } from '@algolia/recommend-core/src';

export type FacetsViewProps<
  TItem extends FacetEntry,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent({ item: TItem }): JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
