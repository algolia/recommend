import {
  getBatchRecommendations,
  getPersonalizationFilters,
  isPersonalized,
  PersonalizationProps,
} from '@algolia/recommend-core';
import React from 'react';

import {
  reducer,
  getQueryKeys,
  getCachedPrams,
  getCacheKey,
} from '../Recommend';
import { RecommendProps as RecommendPropsPrimitive } from '../RecommendContext';
import { isPresent } from '../utils/isPresent';

import { GetParametersResult, RecommendContext } from './RecommendContext';
import { isRecommendedForYouQuery, isTrendingFacetsQuery } from './types';

type RecommendWidget<TResult> = {
  getParameters: () => GetParametersResult<any>;
  onResult: (value: TResult) => void;
  onRequest: () => void;
  key: string;
  param: GetParametersResult<any>;
};

type RecommendProps =
  | RecommendPropsPrimitive
  | (RecommendPropsPrimitive & PersonalizationProps);

const getPersonalization = async (
  appId: string,
  apiKey: string,
  personalizationProps: PersonalizationProps[]
): Promise<Record<string, string[]>> => {
  const results = await Promise.all(
    personalizationProps.map(({ userToken, region }) =>
      getPersonalizationFilters({ appId, apiKey, userToken, region })
    )
  );

  const personalizationData = results.reduce((acc, result, index) => {
    const { userToken } = personalizationProps[index];
    acc[userToken] = result;
    return acc;
  }, {} as Record<string, string[]>);

  return personalizationData;
};

export function Recommend<TObject>({
  recommendClient,
  children,
  ...props
}: RecommendProps) {
  const { userToken, region } = isPersonalized(props)
    ? props
    : { userToken: undefined, region: undefined };

  const [state, dispatch] = React.useReducer(reducer, {
    isDirty: null,
    cache: {},
    widgets: [],
    recommendClient,
  });

  React.useEffect(() => {
    (async () => {
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

      const personalizationProps: PersonalizationProps[] = queries
        .map((query) => {
          if (isPersonalized(query)) {
            return { userToken: query.userToken, region: query.region };
          }
          return null;
        })
        .filter(isPresent);
      if (userToken && region) {
        personalizationProps.push({ userToken, region });
      }
      const personalizationPropsSet = Array.from(new Set(personalizationProps));

      const personalisation = await getPersonalization(
        recommendClient.appId,
        recommendClient.transporter.queryParameters['x-algolia-api-key'],
        personalizationPropsSet
      );

      const _queries = queries.map((query) => {
        if (
          isTrendingFacetsQuery<TObject>(query) ||
          isRecommendedForYouQuery(query)
        ) {
          return query;
        }

        const _userToken = isPersonalized(query) ? query.userToken : userToken;
        if (!_userToken) {
          return {
            ...query,
            userToken: undefined,
            region: undefined,
          };
        }

        const personalizationFilters = personalisation[_userToken];

        if (!personalizationFilters) {
          return {
            ...query,
            userToken: undefined,
            region: undefined,
          };
        }

        return {
          ...query,
          userToken: undefined,
          region: undefined,
          queryParameters: {
            ...query.queryParameters,
            optionalFilters: [
              ...personalizationFilters,
              ...(query.queryParameters?.optionalFilters ?? []),
            ],
          },
        };
      });

      const result = await getBatchRecommendations<TObject>({
        recommendClient,
        queries: _queries,
        keys,
      });

      Object.entries(result).forEach(([key, value]) => {
        state.widgets.forEach((widget) => {
          if (widget.key === key) {
            widget.onResult(value);
            state.cache[getCacheKey(widget.param.queries)] = value;
          }
        });
      });

      dispatch({ type: 'request_success' });
    })();
  }, [
    state.isDirty,
    dispatch,
    state.widgets,
    state.cache,
    recommendClient,
    userToken,
    region,
  ]);

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
