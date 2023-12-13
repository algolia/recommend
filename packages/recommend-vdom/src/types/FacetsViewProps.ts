import { FacetEntry } from '@algolia/recommend-core';

import { Renderer } from './Renderer';

export type FacetsViewProps<
  TFacetType,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent<TComponentProps extends Record<string, unknown> = {}>(
    props: { item: FacetEntry<TFacetType> } & Renderer & TComponentProps
  ): JSX.Element;
  items: Array<FacetEntry<TFacetType>>;
  translations: TTranslations;
};
