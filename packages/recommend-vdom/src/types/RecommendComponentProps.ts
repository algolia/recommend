import { FacetEntry, RecordWithObjectID } from '@algolia/recommend-core';

import { FacetsViewProps } from './FacetsViewProps';
import { RecommendClassNames } from './RecommendClassNames';
import { RecommendStatus } from './RecommendStatus';
import { RecommendTranslations } from './RecommendTranslations';
import { Renderer, VNode } from './Renderer';
import { ViewProps } from './ViewProps';

export type ItemComponentProps<TObject> = {
  item: TObject;
} & Renderer;

export type HeaderComponentProps<TObject> = Renderer & ComponentProps<TObject>;

export type ComponentProps<TObject> = {
  classNames: RecommendClassNames;
  recommendations: TObject[];
  translations: RecommendTranslations;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Fallback(): VNode | null;
  Header(props: HeaderComponentProps<TObject>): VNode | null;
  status: RecommendStatus;
  View(props: unknown): VNode | null;
};

export type RecommendComponentProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = {
  itemComponent(
    props: ItemComponentProps<RecordWithObjectID<TObject>> & TComponentProps
  ): VNode | VNode[];
  items: Array<RecordWithObjectID<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject>): VNode | VNode[] | null;
  fallbackComponent?(props: Renderer & TComponentProps): VNode | VNode[] | null;
  headerComponent?(
    props: HeaderComponentProps<TObject> & TComponentProps
  ): VNode | VNode[] | null;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    > &
      TComponentProps
  ): VNode | VNode[] | null;
};

export type TrendingComponentProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = {
  itemComponent(
    props: ItemComponentProps<FacetEntry<TObject>> & TComponentProps
  ): VNode | VNode[];
  items: Array<FacetEntry<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject>): VNode;
  fallbackComponent?(props: Renderer & TComponentProps): VNode | VNode[] | null;
  headerComponent?(
    props: HeaderComponentProps<TObject> & TComponentProps
  ): VNode | VNode[] | null;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: FacetsViewProps<
      FacetEntry<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    > &
      TComponentProps
  ): VNode | VNode[] | null;
};
