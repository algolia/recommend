import { RecommendClient } from '@algolia/recommend';
import { BatchQuery } from '@algolia/recommend-core';
import { dequal } from 'dequal';

import { GetParametersResult, RecommendWidget } from '../RecommendContext';

type StateType<TObject> = {
  isDirty: number | null;
  cache: Record<string, TObject>;
  widgets: Array<RecommendWidget<TObject>>;
  recommendClient: RecommendClient | null;
};

type Action<TObject> =
  | { type: 'register'; widget: Omit<RecommendWidget<TObject>, 'param'> }
  | { type: 'unregister'; key: string }
  | { type: 'request_success' };

import { isPresent } from './isPresent';

export function getCacheKey<TObject>(queries: Array<BatchQuery<TObject>>) {
  return JSON.stringify(queries);
}

function isCached<TObject>(
  cache: StateType<TObject>['cache'],
  queries: Array<BatchQuery<TObject>>
) {
  return Boolean(cache[getCacheKey(queries)]);
}

export function getCachedPrams<TObject>(
  widgets: Array<RecommendWidget<TObject>>,
  cache: StateType<TObject>['cache']
) {
  return widgets
    .map((widget) => {
      if (isCached(cache, widget.param.queries)) {
        const cachedValue = cache[getCacheKey(widget.param.queries)];
        widget.onResult(cachedValue);
        return null; // No need to call API if we have value from cache
      }
      return widget.param;
    })
    .filter(isPresent);
}

export function getQueryKeys<TObject>(
  params: Array<GetParametersResult<TObject>>
) {
  const queries = params
    .map((p) => p.queries)
    .reduce((a, b) => a.concat(b), []);
  const keys = params.map((p) => p.keyPair);
  return { queries, keys };
}

function isRegistered<TObject>(
  widgets: Array<RecommendWidget<TObject>>,
  param: GetParametersResult<TObject>
) {
  return Boolean(widgets.find((w) => dequal(w.param, param)));
}

// Not sure about using "unknown"/"any" here ?
export const reducer: React.Reducer<StateType<unknown>, Action<any>> = (
  state,
  action
) => {
  const { type } = action;
  switch (type) {
    case 'register': {
      const { widget } = action;
      const param = widget.getParameters();
      const isPreviouslyRegistered = isRegistered(state.widgets, param);
      if (!isPreviouslyRegistered) {
        return {
          ...state,
          widgets: [...state.widgets, { ...widget, param }],
          isDirty: Date.now(),
        };
      }

      return state;
    }

    case 'unregister': {
      const { key } = action;
      return { ...state, widgets: state.widgets.filter((w) => w.key !== key) };
    }

    case 'request_success': {
      return { ...state, status: 'idle', isDirty: null };
    }

    default:
      return state;
  }
};
