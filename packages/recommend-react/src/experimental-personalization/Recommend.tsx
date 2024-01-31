import {
  getBatchRecommendations,
  getPersonalizationFilters,
  isPersonalizationEnabled,
  PersonalizationProps,
  getPersonalizationProps,
} from '@algolia/recommend-core';
import React from 'react';

import { RecommendProps as RecommendPropsPrimitive } from '../RecommendContext';
import {
  reducer,
  getQueryKeys,
  getCachedPrams,
  getCacheKey,
} from '../utils/context-helpers';
import { isPresent } from '../utils/isPresent';

import { useBetaWarning } from './beta-warning/useBetaWarning';
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
    const { userToken, region } = personalizationProps[index];
    acc[`${region}_${userToken}`] = result;
    return acc;
  }, {} as Record<string, string[]>);

  return personalizationData;
};

export function Recommend<TObject>({
  recommendClient,
  children,
  ...props
}: RecommendProps) {
  const {
    userToken,
    region,
    suppressExperimentalWarning,
  } = getPersonalizationProps(props);

  const [state, dispatch] = React.useReducer(reducer, {
    isDirty: null,
    cache: {},
    widgets: [],
    recommendClient,
  });

  useBetaWarning(suppressExperimentalWarning, '<Recommend>');

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
          if (isPersonalizationEnabled(query)) {
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

        const { _userToken, _region } = isPersonalizationEnabled(query)
          ? { _userToken: query.userToken, _region: query.region }
          : { _userToken: userToken, _region: region };
        if (!_userToken || !_region) {
          return {
            ...query,
            userToken: undefined,
            region: undefined,
          };
        }

        const personalizationFilters =
          personalisation[`${_region}_${_userToken}`];

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

      if (Object.keys(personalisation).length > 0) {
        recommendClient.addAlgoliaAgent('experimental-personalization');
      }

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
