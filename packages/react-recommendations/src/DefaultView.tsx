import React from 'react';

import { RecordWithObjectID, ViewProps } from './types';

export function DefaultView<TItem extends RecordWithObjectID>(
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
