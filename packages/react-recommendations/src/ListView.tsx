import React, { createElement, Fragment } from 'react';

import {
  RecommendationClassNames,
  RecommendationTranslations,
  RecordWithObjectID,
  ViewProps,
} from './types';
import { cx } from './utils';

export function ListView<TItem extends RecordWithObjectID>(
  props: ViewProps<TItem, RecommendationTranslations, RecommendationClassNames>
) {
  return (
    <div
      className={cx(
        'auc-Recommendations-container',
        props.classNames.container
      )}
    >
      <ol className={cx('auc-Recommendations-list', props.classNames.list)}>
        {props.items.map((item) => (
          <li
            key={item.objectID}
            className={cx('auc-Recommendations-item', props.classNames.item)}
          >
            <props.itemComponent
              createElement={createElement}
              Fragment={Fragment}
              item={item}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
