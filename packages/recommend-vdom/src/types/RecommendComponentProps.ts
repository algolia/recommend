import { FacetEntry, RecordWithObjectID } from '@algolia/recommend-core';

import { FacetsViewProps } from './FacetsViewProps';
import { RecommendClassNames } from './RecommendClassNames';
import { RecommendStatus } from './RecommendStatus';
import { RecommendTranslations } from './RecommendTranslations';
import { Pragma, PragmaFrag } from './Renderer';
import { ViewProps } from './ViewProps';

export type ItemComponentProps<TObject> = {
  item: TObject;
} & RenderProps;

export type RenderProps = {
  createElement: Pragma;
  Fragment: PragmaFrag;
};

export type HeaderComponentProps<TObject> = RenderProps &
  ComponentProps<TObject>;

export type ComponentProps<TObject> = {
  classNames: RecommendClassNames;
  recommendations: TObject[];
  translations: RecommendTranslations;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Fallback(): JSX.Element | null;
  Header(props: HeaderComponentProps<TObject>): JSX.Element | null;
  status: RecommendStatus;
  View(props: unknown): JSX.Element;
};

export type RecommendComponentProps<TObject> = {
  itemComponent(props: ItemComponentProps<TObject>): JSX.Element;
  items: Array<RecordWithObjectID<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  fallbackComponent?(): JSX.Element;
  headerComponent?(props: HeaderComponentProps<TObject>): JSX.Element;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    >
  ): JSX.Element;
};

export type TrendingComponentProps<TObject> = {
  itemComponent(props: ItemComponentProps<TObject>): JSX.Element;
  items: Array<FacetEntry<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  fallbackComponent?(): JSX.Element;
  headerComponent?(props: HeaderComponentProps<TObject>): JSX.Element;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: FacetsViewProps<
      FacetEntry<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    >
  ): JSX.Element;
};
