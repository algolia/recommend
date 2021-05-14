import React from 'react';

import { ProductBaseRecord } from './types';

export type ViewProps<
  TItem extends ProductBaseRecord,
  TTranslations extends Record<string, string>,
  TClassNames extends Record<string, string>
> = {
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
  classNames?: Partial<TClassNames>;
  translations?: Partial<TTranslations>;
};

export function DefaultView<TItem extends ProductBaseRecord>(
  props: ViewProps<TItem, {}, {}>
) {
  return (
    <div className="auc-Recommendations-container">
      <ol className="auc-Recommendations-list">
        {props.items.map((item) => (
          <li key={item.objectID} className="auc-Recommendations-item">
            <props.itemComponent item={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}
