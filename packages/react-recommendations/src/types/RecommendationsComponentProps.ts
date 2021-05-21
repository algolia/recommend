import { RecommendationClassNames } from './RecommendationClassNames';
import { RecommendationTranslations } from './RecommendationTranslations';
import { RecordWithObjectID } from './RecordWithObjectID';
import { ViewProps } from './ViewProps';

export type ChildrenProps<TObject> = {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
  View(props: unknown): JSX.Element;
};

export type RecommendationsComponentProps<TObject> = {
  itemComponent({ item: TObject }): JSX.Element;
  classNames?: RecommendationClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  translations?: Required<RecommendationTranslations>;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      Required<RecommendationTranslations>,
      Record<string, string>
    >
  ): JSX.Element;
};
