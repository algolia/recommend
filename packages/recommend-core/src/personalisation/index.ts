import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { PersonaliseRecommendations } from './types';

export async function personaliseRecommendations<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>) {
  try {
    const affinities = await getPersonalisationAffinities(options);

    // eslint-disable-next-line no-console
    console.log({ affinities });

    return hits;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return hits;
  }
}
