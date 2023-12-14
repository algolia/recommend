/** @jsx createElement */

import {
  RecommendClassNames,
  RecommendTranslations,
  Renderer,
  FacetsViewProps,
} from './types';
import { cx } from './utils';

export function createFacetsView({ createElement, Fragment }: Renderer) {
  return function FacetsView(
    props: FacetsViewProps<RecommendTranslations, RecommendClassNames>
  ) {
    return (
      <div
        className={cx('auc-Recommend-container', props.classNames.container)}
      >
        <ol className={cx('auc-Recommend-list', props.classNames.list)}>
          {props.items.map((item) => (
            <li
              key={`${item.facetValue}`}
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
