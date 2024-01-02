import { RecommendClient } from '@algolia/recommend';
import {
  BatchKeyPair,
  BatchRecommendations,
  BatchQuery,
} from '@algolia/recommend-core';
import { Experimental } from '@algolia/recommend-core/src/types/Experimental';
import React from 'react';

export type GetParametersResult<TObject> = {
  queries: Array<BatchQuery<TObject>>;
  experimental?: Experimental;
  keyPair: BatchKeyPair;
};

export type RecommendWidget<TObject> = {
  getParameters: () => GetParametersResult<any>;
  onResult: (value: BatchRecommendations<TObject>) => void;
  onRequest: () => void;
  key: string;
  param: GetParametersResult<any>;
};

type RecommendContextType<TObject> = {
  register: (widget: Omit<RecommendWidget<TObject>, 'param'>) => () => void;
  hasProvider: boolean;
  recommendClient: RecommendClient;
};

export type RecommendProps = {
  children: React.ReactNode;
  recommendClient: RecommendClient;
};

export const RecommendContext = React.createContext<
  RecommendContextType<unknown> // Not sure about using "unknown" here ?
>({
  hasProvider: false,
} as RecommendContextType<unknown>);

if (__DEV__) {
  RecommendContext.displayName = 'Recommend';
}
export const useRecommendContext = () => React.useContext(RecommendContext);

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
