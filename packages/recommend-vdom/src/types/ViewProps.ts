import { RecordWithObjectID } from '@algolia/recommend-core';

import { Renderer } from './Renderer';

export type ViewProps<
  TItem extends RecordWithObjectID,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent<TComponentProps extends Record<string, unknown> = {}>(
    props: { item: TItem } & Renderer & TComponentProps
  ): JSX.Element;
  items: TItem[];
  translations: TTranslations;
};
