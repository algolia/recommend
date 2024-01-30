/** @jsxRuntime classic */
/** @jsx createElement */
import { RecordWithObjectID } from '@algolia/recommend-core';

import {
  RecommendClassNames,
  RecommendTranslations,
  Renderer,
  ViewProps,
} from './types';
import { cx } from './utils';

export function createListViewComponent({ createElement, Fragment }: Renderer) {
  return function ListView<TItem extends RecordWithObjectID>(
    props: ViewProps<TItem, RecommendTranslations, RecommendClassNames>
  ) {
    return (
      <div
        className={cx('auc-Recommend-container', props.classNames.container)}
      >
        <ol className={cx('auc-Recommend-list', props.classNames.list)}>
          {props.items.map((item) => (
            <li
              key={item.objectID}
              className={cx('auc-Recommend-item', props.classNames.item)}
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
  };
}
