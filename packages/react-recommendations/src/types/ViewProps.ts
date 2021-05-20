import {
  ItemComponentProps,
  RendererProps,
} from './RecommendationsComponentProps';
import { RecordWithObjectID } from './RecordWithObjectID';

export type ViewProps<
  TItem extends RecordWithObjectID,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = RendererProps & {
  classNames: TClassNames;
  itemComponent(
    props: ItemComponentProps<RecordWithObjectID<TItem>>
  ): JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
