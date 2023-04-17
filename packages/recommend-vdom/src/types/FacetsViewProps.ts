import { FacetEntry } from '@algolia/recommend-core';

import { Renderer } from './Renderer';

export type FacetsViewProps<
  TItem extends FacetEntry,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent: <TComponentProps extends Record<string, unknown> = {}>(
    props: Renderer & TComponentProps & { item: TItem }
  ) => JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
