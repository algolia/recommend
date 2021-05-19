import { RecommendationTranslations } from './RecommendationTranslations';
import { RecordWithObjectID } from './RecordWithObjectID';
import { ViewProps } from './ViewProps';

export type ChildrenProps<TObject> = {
  recommendations: TObject[];
  View(props: unknown): JSX.Element;
  translations: RecommendationTranslations;
};

export type RecommendationsComponentProps<TObject> = {
  itemComponent({ item: TObject }): JSX.Element;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  translations?: RecommendationTranslations;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      RecommendationTranslations,
      Record<string, string>
    >
  ): JSX.Element;
};
