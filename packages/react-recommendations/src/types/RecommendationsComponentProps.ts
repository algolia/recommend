import { RecommendationClassNames } from './RecommendationClassNames';
import { RecommendationTranslations } from './RecommendationTranslations';
import { RecordWithObjectID } from './RecordWithObjectID';
import { ViewProps } from './ViewProps';

export type ComponentProps<TObject> = {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Header(props: ComponentProps<TObject>): JSX.Element | null;
  View(props: unknown): JSX.Element;
};

export type RecommendationsComponentProps<TObject> = {
  itemComponent({ item: TObject }): JSX.Element;
  classNames?: RecommendationClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
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
