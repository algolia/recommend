import { RecommendClient } from '@algolia/recommend';

export const pickRecommendClient = (
  recommendClientFromContext?: RecommendClient | null,
  recommendClientFromComponent?: RecommendClient | null
): { client: RecommendClient; isContextClient: boolean } => {
  if (recommendClientFromContext && recommendClientFromComponent) {
    return { client: recommendClientFromComponent, isContextClient: false };
  }

  if (recommendClientFromContext) {
    return { client: recommendClientFromContext, isContextClient: true };
  }

  if (recommendClientFromComponent) {
    return { client: recommendClientFromComponent, isContextClient: false };
  }

  throw new Error( // To do work on error message
    'Pass an Algolia `recommendClient` instance either to the RecommendContext, a library component or hook.'
  );
};
