import { RecordWithObjectID } from '@algolia/recommend-core';

import { Renderer, VNode } from './Renderer';

export type ViewProps<
  TItem extends RecordWithObjectID,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  classNames: TClassNames;
  itemComponent<TComponentProps extends Record<string, unknown> = {}>(
    props: { item: TItem } & Renderer & TComponentProps
  ): VNode;
  items: TItem[];
  translations: TTranslations;
};
