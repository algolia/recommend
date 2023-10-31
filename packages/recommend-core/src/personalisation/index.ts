/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { PersonaliseRecommendations } from './types';

export async function personaliseRecommendations<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>) {
  try {
    const affinities = await getPersonalisationAffinities(options);

    const _hits = hits.map((hit) => {
      return { ...hit, _score_personalised: hit._score ?? 0 };
    });

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([facetValue, score]) => {
        _hits.forEach((hit) => {
          if (getNestedValue(hit, facet) === facetValue) {
            hit._score_personalised += score;
          }
        });
      });
    });

    // normalise scores
    const delta =
      _hits.reduce((max, hit) => Math.max(max, hit._score_personalised), 0) -
      100;

    return _hits
      .sort((a, b) => b._score_personalised - a._score_personalised)
      .map((hit) => {
        const h = {
          ...hit,
          _score: Math.max(hit._score_personalised - delta, 0),
        };
        // @ts-expect-error
        delete h._score_personalised;
        return h;
      });
  } catch (e) {
    console.error(e);
    return hits;
  }
}

// to do: Add unit tests
// eslint-disable-next-line @typescript-eslint/ban-types
function getNestedValue(obj: Object, path: string) {
  const keys = path.split('.');
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!isNaN(Number(key)) && Array.isArray(current)) {
      if (current[key] === undefined) {
        return undefined;
      } else {
        current = current[key];
      }
    } else if (current[key] === undefined) {
      return undefined;
    } else {
      current = current[key];
    }
  }
  return current;
}
