import { RecordWithObjectID } from '@algolia/recommend-core';

export type ViewProps<
  TItem extends RecordWithObjectID,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent({
    item: TItem,
    createElement: Pragma,
    Fragment: PragmaFrag,
  }): JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
