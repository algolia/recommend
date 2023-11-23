import { ProductRecord } from '../../types';
import { applyAffinities } from '../helpers';
import { PersonaliseRecommendations } from '../types';

import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { getPersonalisationStrategy } from './getPersonalisationStrategy';

export async function personaliseRecommendationsV1<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>): Promise<
  Array<ProductRecord<ProductRecord<TObject>>>
> {
  try {
    if (!options.userToken || !options.logRegion) {
      return hits;
    }

    const affinities = await getPersonalisationAffinities(options);
    const strategy = await getPersonalisationStrategy({
      apiKey: options.apiKey,
      appID: options.appID,
      logRegion: options.logRegion,
    });

    return applyAffinities(affinities, strategy, hits);
  } catch (e) {
    return hits;
  }
}
