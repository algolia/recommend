import { RecommendationsQuery, RecommendClient } from '@algolia/recommend';
import {
  BatchKeyPair,
  BatchRecommendations,
  getBatchRecommendations,
  BatchQuery,
} from '@algolia/recommend-core';
import { dequal } from 'dequal';
import React from 'react';

import { isPresent } from './utils/isPresent';

type GetParametersResult<TObject> = {
  queries: Array<BatchQuery<TObject>>;
  keyPair: BatchKeyPair;
};

type RecommendWidget<TObject> = {
  getParameters: () => GetParametersResult<any>;
  onResult: (value: BatchRecommendations<TObject>) => void;
  onRequest: () => void;
  key: string;
  param: GetParametersResult<any>;
};

type RecommendContextType<TObject> = {
  register: (
    widget: Omit<RecommendWidget<TObject>, 'param'>
  ) => (key: string) => void;
  hasProvider: boolean;
  recommendClient: RecommendClient;
};

export type RecommendProps = {
  children: React.ReactNode;
  recommendClient: RecommendClient;
};

type StateType<TObject> = {
  isDirty: number | null;
  cache: Record<string, BatchRecommendations<TObject>>;
  widgets: Array<RecommendWidget<TObject>>;
  recommendClient: RecommendClient | null;
};

type Action<TObject> =
  | { type: 'register'; widget: Omit<RecommendWidget<TObject>, 'param'> }
  | { type: 'unregister'; key: string }
  | { type: 'request_success' };

export const RecommendContext = React.createContext<
  RecommendContextType<unknown> // Not sure about using "unknown" here ?
>({
  hasProvider: false,
} as RecommendContextType<unknown>);

if (__DEV__) {
  RecommendContext.displayName = 'Recommend';
}

export const useRecommendClient = (
  recommendClient?: RecommendClient | null
): { client: RecommendClient; isContextClient: boolean } => {
  const context = React.useContext(RecommendContext);
  if (recommendClient) {
    return { client: recommendClient, isContextClient: false };
  }

  if (context.recommendClient) {
    return { client: context.recommendClient, isContextClient: true };
  }

  throw new Error( // To do work on error message
    'Pass an Algolia `recommendClient` instance either to the Recommend React context, a component or hook.'
  );
};

export const useRecommendContext = () => React.useContext(RecommendContext);

function isRegistered<TObject>(
  widgets: Array<RecommendWidget<TObject>>,
  param: GetParametersResult<TObject>
) {
  return Boolean(widgets.find((w) => dequal(w.param, param)));
}

const getCacheKey = (queries: RecommendationsQuery[]) => {
  return JSON.stringify(queries);
};

function isCached<TObject>(
  cache: StateType<TObject>['cache'],
  queries: RecommendationsQuery[]
) {
  return Boolean(cache[getCacheKey(queries)]);
}

function getCachedPrams<TObject>(
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

function getQueryKeys<TObject>(params: Array<GetParametersResult<TObject>>) {
  const queries = params
    .map((p) => p.queries)
    .reduce((a, b) => a.concat(b), []);
  const keys = params.map((p) => p.keyPair);
  return { queries, keys };
}

// Not sure about using "unknown"/"any" here ?
const reducer: React.Reducer<StateType<unknown>, Action<any>> = (
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