import { RecordWithObjectID, TrendingFacetHit } from '@algolia/recommend-core';

import { FacetsViewProps } from './FacetsViewProps';
import { RecommendClassNames } from './RecommendClassNames';
import { RecommendStatus } from './RecommendStatus';
import { RecommendTranslations } from './RecommendTranslations';
import { Renderer } from './Renderer';
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
  Fallback(): JSX.Element | null;
  Header(props: HeaderComponentProps<TObject>): JSX.Element | null;
  status: RecommendStatus;
  View(props: unknown): JSX.Element;
};

export type RecommendComponentProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = {
  itemComponent(
    props: ItemComponentProps<RecordWithObjectID<TObject>> & TComponentProps
  ): JSX.Element;
  items: Array<RecordWithObjectID<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject> & TComponentProps): JSX.Element;
  fallbackComponent?(props: Renderer & TComponentProps): JSX.Element;
  headerComponent?(
    props: HeaderComponentProps<TObject> & TComponentProps
  ): JSX.Element;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    > &
      Renderer &
      TComponentProps
  ): JSX.Element;
};

export type TrendingComponentProps<
  TComponentProps extends Record<string, unknown> = {}
> = {
  itemComponent(
    props: ItemComponentProps<TrendingFacetHit> & TComponentProps
  ): JSX.Element;
  items: TrendingFacetHit[];
  classNames?: RecommendClassNames;
  children?(
    props: ChildrenProps<TrendingFacetHit> & TComponentProps
  ): JSX.Element;
  fallbackComponent?(props: Renderer & TComponentProps): JSX.Element;
  headerComponent?(
    props: HeaderComponentProps<TrendingFacetHit> & TComponentProps
  ): JSX.Element;
  status: RecommendStatus;
  translations?: RecommendTranslations;
  view?(
    props: FacetsViewProps<
      Required<RecommendTranslations>,
      Record<string, string>
    > &
      Renderer &
      TComponentProps
  ): JSX.Element;
};
