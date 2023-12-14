import { TrendingFacetHit } from '@algolia/recommend';

import { Renderer } from './Renderer';

export type FacetsViewProps<
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent<TComponentProps extends Record<string, unknown> = {}>(
    props: { item: TrendingFacetHit } & Renderer & TComponentProps
  ): JSX.Element;
  items: TrendingFacetHit[];
  translations: TTranslations;
};
