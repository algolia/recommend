import { RecommendationClassNames } from './RecommendationClassNames';
import { RecommendationTranslations } from './RecommendationTranslations';
import { RecordWithObjectID } from './RecordWithObjectID';
import { ViewProps } from './ViewProps';

type ComponentChild =
  | JSX.Element
  | object
  | string
  | number
  | boolean
  | null
  | undefined;
type ComponentChildren = ComponentChild[] | ComponentChild;

export type ComponentProps<TObject> = RendererProps & {
  classNames: RecommendationClassNames;
  recommendations: TObject[];
  translations: Required<RecommendationTranslations>;
};

export type ChildrenProps<TObject> = ComponentProps<TObject> & {
  Fallback(props: RendererProps): JSX.Element | null;
  Header(props: ComponentProps<TObject>): JSX.Element | null;
  View(props: RendererProps & unknown): JSX.Element;
};

export type ItemComponentProps<TObject> = RendererProps & {
  item: TObject;
};

export type RendererProps = {
  /**
   * The function to create JSX Elements.
   *
   * @default React.createElement
   */
  createElement: (
    type: any,
    props: Record<string, any> | null,
    ...children: ComponentChildren[]
  ) => JSX.Element;
  /**
   * The component to use to create fragments.
   *
   * @default React.Fragment
   */
  Fragment: any;
};

export type RecommendationsComponentProps<TObject> = {
  itemComponent(props: ItemComponentProps<TObject>): JSX.Element;
  classNames?: RecommendationClassNames;
  children?(props: ChildrenProps<TObject>): JSX.Element;
  fallbackComponent?(props: RendererProps): JSX.Element;
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
