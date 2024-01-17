import { RecommendClient } from '@algolia/recommend';
import {
  BatchKeyPair,
  BatchQuery as BatchQueryPrimitive,
  PersonalizationProps,
} from '@algolia/recommend-core';
import React from 'react';

type BatchQuery<TObject> =
  | BatchQueryPrimitive<TObject>
  | (BatchQueryPrimitive<TObject> & PersonalizationProps);

export type GetParametersResult<TObject> = {
  queries: Array<BatchQuery<TObject>>;
  keyPair: BatchKeyPair;
};

export type RecommendWidget<TResult> = {
  getParameters: () => GetParametersResult<any>;
  onResult: (value: TResult) => void;
  onRequest: () => void;
  key: string;
  param: GetParametersResult<any>;
};

type RecommendContextType<TResult> = {
  register: (widget: Omit<RecommendWidget<TResult>, 'param'>) => () => void;
  hasProvider: boolean;
  recommendClient: RecommendClient;
};

export const RecommendContext = React.createContext<RecommendContextType<any>>({
  hasProvider: false,
} as RecommendContextType<any>);

if (__DEV__) {
  RecommendContext.displayName = 'Recommend (experimental-personalization)';
}
export const useRecommendContext = <TResult,>() =>
  React.useContext<RecommendContextType<TResult>>(RecommendContext);

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
