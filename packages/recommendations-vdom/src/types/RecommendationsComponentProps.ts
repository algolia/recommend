import { RecordWithObjectID } from '@algolia/recommendations-core';

import { RecommendationClassNames } from './RecommendationClassNames';
import { RecommendationTranslations } from './RecommendationTranslations';
import { ViewProps } from './ViewProps';

export type ComponentProps<TObject> = {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Fallback(): JSX.Element | null;
  Header(props: ComponentProps<TObject>): JSX.Element | null;
  View(props: unknown): JSX.Element;
};

export type RecommendationsComponentProps<TObject> = {
  itemComponent({ item: TObject }): JSX.Element;
  items: Array<RecordWithObjectID<TObject>>;
  classNames?: RecommendationClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  fallbackComponent?(): JSX.Element;
  headerComponent?(props: ComponentProps<TObject>): JSX.Element;
  translations?: Required<RecommendationTranslations>;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendationTranslations>,
      Record<string, string>
    >
  ): JSX.Element;
};
