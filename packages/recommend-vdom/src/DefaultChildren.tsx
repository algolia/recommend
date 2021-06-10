/** @jsx createElement */

import { ChildrenProps, Renderer } from './types';
import { cx } from './utils';

export function createDefaultChildrenComponent({ createElement }: Renderer) {
  return function DefaultChildren<TObject>(props: ChildrenProps<TObject>) {
    if (props.recommendations.length === 0) {
      return <props.Fallback />;
    }

    return (
      <section className={cx('auc-Recommendations', props.classNames.root)}>
        <props.Header
          classNames={props.classNames}
          recommendations={props.recommendations}
          translations={props.translations}
        />

        <props.View />
      </section>
    );
  };
}
