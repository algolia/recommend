import React, { createElement, Fragment } from 'react';

import { ChildrenProps } from './types';
import { cx } from './utils';

export function DefaultChildren<TObject>(props: ChildrenProps<TObject>) {
  if (props.recommendations.length === 0) {
    return <props.Fallback createElement={createElement} Fragment={Fragment} />;
  }

  return (
    <section className={cx('auc-Recommendations', props.classNames.root)}>
      <props.Header
        classNames={props.classNames}
        createElement={createElement}
        Fragment={Fragment}
        recommendations={props.recommendations}
        translations={props.translations}
      />

      <props.View createElement={createElement} Fragment={Fragment} />
    </section>
  );
}
