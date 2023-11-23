import { ProductRecord } from '../types';

import { computePersonalisationFiltersNeural } from './neural/computePersonalisationFilters';
import { personaliseRecommendationsNeural } from './neural/personaliseRecommendations';
import {
  ComputePersonalisationFilters,
  PersonaliseRecommendations,
} from './types';
import { computePersonalisationFiltersV1 } from './v1/computePersonalisationFilters';
import { personaliseRecommendationsV1 } from './v1/personaliseRecommendations';

// Approach 1: Re-rank
export function personaliseRecommendations<TObject>(
  params: PersonaliseRecommendations<TObject>
): Promise<Array<ProductRecord<ProductRecord<TObject>>>> {
  if (params.personalisationVersion === 'v1') {
    return personaliseRecommendationsV1(params);
  }

  return personaliseRecommendationsNeural(params);
}

// Approach 2: Filters
export const computePersonalisationFilters = (
  params: ComputePersonalisationFilters
) => {
  if (params.personalisationVersion === 'v1') {
    return computePersonalisationFiltersV1(params);
  }
  return computePersonalisationFiltersNeural(params);
};
