import { RecordWithObjectID } from './RecordWithObjectID';

// @TODO: extract this type to a shared package
export type ViewProps<
  TItem extends RecordWithObjectID,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
  classNames?: Partial<TClassNames>;
  translations?: Partial<TTranslations>;
};
