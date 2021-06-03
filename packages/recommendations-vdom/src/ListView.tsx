/** @jsx createElement */
import { RecordWithObjectID } from '@algolia/recommendations-core';

import {
  RecommendationClassNames,
  RecommendationTranslations,
  Renderer,
  ViewProps,
} from './types';
import { cx } from './utils';

export function createListViewComponent({ createElement }: Renderer) {
  return function ListView<TItem extends RecordWithObjectID>(
    props: ViewProps<
      TItem,
      RecommendationTranslations,
      RecommendationClassNames
    >
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
              <props.itemComponent item={item} />
            </li>
          ))}
        </ol>
      </div>
    );
  };
}
