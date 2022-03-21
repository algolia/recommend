/** @jsx createElement */
import { FacetEntry } from '@algolia/recommend-core/src';

import {
  RecommendClassNames,
  RecommendTranslations,
  Renderer,
  FacetsViewProps,
} from './types';
import { cx } from './utils';

export function createFacetsView({ createElement }: Renderer) {
  return function FacetsView<TItem extends FacetEntry>(
    props: FacetsViewProps<TItem, RecommendTranslations, RecommendClassNames>
  ) {
    return (
      <div
        className={cx('auc-Recommend-container', props.classNames.container)}
      >
        <ol className={cx('auc-Recommend-list', props.classNames.list)}>
          {props.items.map((item) => (
            <li
              key={item.facetValue}
              className={cx('auc-Recommend-item', props.classNames.item)}
            >
              <props.itemComponent item={item} />
            </li>
          ))}
        </ol>
      </div>
    );
  };
}
