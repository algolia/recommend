import { ProductRecord } from '../../types';
import { applyAffinities, mapProfileToAffinities } from '../helpers';
import { PersonaliseRecommendations } from '../types';

import { getUserProfile } from './getUserProfile';

export async function personaliseRecommendationsNeural<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>): Promise<
  Array<ProductRecord<ProductRecord<TObject>>>
> {
  try {
    if (!options.userToken || !options.logRegion) {
      return hits;
    }

    const profile = await getUserProfile({
      ...options,
    });

    return applyAffinities(mapProfileToAffinities(profile), null, hits);
  } catch (e) {
    return hits;
  }
}
