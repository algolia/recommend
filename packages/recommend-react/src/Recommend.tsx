import { getBatchRecommendations } from '@algolia/recommend-core';
import React from 'react';

import {
  RecommendContext,
  RecommendProps,
  RecommendWidget,
} from './RecommendContext';
import {
  getCacheKey,
  getCachedPrams,
  getQueryKeys,
  reducer,
} from './utils/context-helpers';

export function Recommend<TObject>({
  recommendClient,
  children,
}: RecommendProps) {
  const [state, dispatch] = React.useReducer(reducer, {
    isDirty: null,
    cache: {},
    widgets: [],
    recommendClient,
  });

  React.useEffect(() => {
    if (!state.isDirty) {
      return;
    }

    const params = getCachedPrams<unknown>(state.widgets, state.cache); // ⚠️ Has side-effects
    if (params.length === 0) {
      return; // Return early if everything is cached
    }
    const { queries, keys } = getQueryKeys(params);

    keys.forEach((key) => {
      state.widgets.forEach((widget) => {
        if (widget.key === key.key) {
          widget.onRequest();
        }
      });
    });

    getBatchRecommendations<TObject>({
      recommendClient,
      queries,
      keys,
    }).then((result) => {
      Object.entries(result).forEach(([key, value]) => {
        state.widgets.forEach((widget) => {
          if (widget.key === key) {
            widget.onResult(value);
            state.cache[getCacheKey(widget.param.queries)] = value;
          }
        });
      });

      dispatch({ type: 'request_success' });
    });
  }, [state.isDirty, dispatch, state.widgets, state.cache, recommendClient]);

  const register = React.useCallback(
    (widget: Omit<RecommendWidget<TObject>, 'param'>) => {
      dispatch({ type: 'register', widget });
      return () => {
        dispatch({ type: 'unregister', key: widget.key });
      };
    },
    []
  );

  const value = React.useMemo(
    () => ({ register, recommendClient, hasProvider: true }),
    [recommendClient, register]
  );

  return (
    <RecommendContext.Provider value={value}>
      {children}
    </RecommendContext.Provider>
  );
}
