import { RecommendationTranslations } from './RecommendationTranslations';
import { RecordWithObjectID } from './RecordWithObjectID';
import { ViewProps } from './ViewProps';

export type ChildrenProps<TObject> = {
  recommendations: TObject[];
  View(props: unknown): JSX.Element;
  translations: RecommendationTranslations;
};

export type RecommendationsComponentProps<TObject> = {
  hitComponent({ hit: TObject }): JSX.Element;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  translations?: Partial<RecommendationTranslations>;
  view?(
    props: ViewProps<
      RecordWithObjectID<TObject>,
      RecommendationTranslations,
      Record<string, string>
    >
  ): JSX.Element;
};
