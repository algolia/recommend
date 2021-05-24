import React from 'react';

import { ComponentProps } from './types';
import { cx } from './utils';

export function DefaultHeader<TObject>(props: ComponentProps<TObject>) {
  if (!props.translations.title) {
    return null;
  }

  return (
    <h3 className={cx('auc-Recommendations-title', props.classNames.title)}>
      {props.translations.title}
    </h3>
  );
}
