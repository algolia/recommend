import { useEffect } from 'react';

import { warn } from './warn';

export const useBetaWarning = (
  suppressExperimentalWarning: boolean,
  componentName: string
) => {
  useEffect(() => {
    warn(
      suppressExperimentalWarning,
      `Personalized Recommendations are experimental and subject to change.
If you have any feedback, please let us know at https://github.com/algolia/recommend/issues/new/choose
(To disable this warning, pass 'suppressExperimentalWarning' to ${componentName})`
    );
  }, [suppressExperimentalWarning, componentName]);
};
