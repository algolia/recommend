import { RecordWithObjectID } from '@algolia/recommend-core';

import { RecommendClassNames } from './RecommendClassNames';
import { RecommendTranslations } from './RecommendTranslations';
import { ViewProps } from './ViewProps';

export type ComponentProps<TObject> = {
  classNames: RecommendClassNames;
  recommendations: TObject[];
  translations: Required<RecommendTranslations>;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Fallback(): JSX.Element | null;
  Header(props: ComponentProps<TObject>): JSX.Element | null;
  View(props: unknown): JSX.Element;
};

export type RecommendComponentProps<TObject> = {
  itemComponent({ item: TObject }): JSX.Element;
  items: Array<RecordWithObjectID<TObject>>;
  classNames?: RecommendClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  fallbackComponent?(): JSX.Element;
  headerComponent?(props: ComponentProps<TObject>): JSX.Element;
  translations?: Required<RecommendTranslations>;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendTranslations>,
      Record<string, string>
    >
  ): JSX.Element;
};
