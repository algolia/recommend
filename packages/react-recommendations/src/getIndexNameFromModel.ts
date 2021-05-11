import { RecommendationModel } from './types';

export function getIndexNameFromModel(
  model: RecommendationModel,
  indexName: string
) {
  switch (model) {
    case 'bought-together':
      return `ai_recommend_bought-together_${indexName}`;
    case 'related-products':
      return `ai_recommend_related-products_${indexName}`;
    default:
      throw new Error(`Unknown model: ${JSON.stringify(model)}.`);
  }
}
