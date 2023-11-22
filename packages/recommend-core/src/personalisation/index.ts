import { ProductRecord } from '../types';

import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { getPersonalisationStrategy } from './getPersonalisationStrategy';
import { PersonaliseRecommendations } from './types';

const p90 = (scores: number[]) => {
  const arr = [...scores].sort((a, b) => a - b);
  const index = Math.ceil(0.9 * arr.length);
  return arr[index - 1];
};

const calculatePosPrime = ({
  pos,
  impact,
  score,
  p90Score,
  textBucket,
}: {
  pos: number;
  impact: number;
  score: number;
  p90Score: number;
  textBucket: Array<{ pos: number }>;
}): number => {
  // Calculate the minimum position within the text bucket
  const minPosInTextBucket = Math.min(...textBucket.map((r) => r.pos));

  // Calculate the power term
  const powerTerm = Math.min(1, score / p90Score);

  // Calculate the new position
  const newPos = Math.floor(pos * Math.pow((100 - impact) / 100, powerTerm));

  // Take the maximum of the minimum position in the text bucket and the calculated new position
  const posPrime = Math.max(minPosInTextBucket, newPos);

  return posPrime;
};

export const getNestedValue = (obj: Record<string, any>, path: string) => {
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
};

export async function personaliseRecommendations<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>): Promise<
  Array<ProductRecord<ProductRecord<TObject>>>
> {
  try {
    const affinities = await getPersonalisationAffinities(options);

    const strategy = await getPersonalisationStrategy({
      apiKey: options.apiKey,
      appID: options.appID,
      logRegion: options.logRegion,
    });

    const _hits = hits.map((hit) => {
      return {
        ...hit,
        __filterScore: 0,
      };
    });

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([facetValue, score]) => {
        _hits.forEach((hit) => {
          if (getNestedValue(hit, facet) === facetValue) {
            const weight =
              strategy.facetsScoring.find((value) => value.facetName === facet)
                ?.score ?? 100;
            const weightedScore = Math.floor(score * (weight / 100));

            hit.__filterScore += weightedScore;
          }
        });
      });
    });

    const scoreP90 = p90(_hits.map((hit) => hit.__filterScore));

    const result = _hits
      .map((hit, index) => {
        const position = calculatePosPrime({
          pos: index,
          impact: 100,
          score: hit.__filterScore,
          p90Score: scoreP90,
          textBucket: [{ pos: 0 }],
        });

        return {
          ...hit,
          position,
        };
      })
      .sort((a, b) => {
        if (a.position === b.position) {
          if (
            a._score !== undefined &&
            b._score !== undefined &&
            a._score !== b._score
          ) {
            return b._score - a._score;
          }
          return b.__filterScore - a.__filterScore; // should never happen
        }
        return a.position - b.position;
      })
      .map((hit: ProductRecord<TObject>) => {
        // @ts-expect-error
        delete hit.__filterScore;
        // @ts-expect-error
        delete hit.position;

        return hit;
      });

    return result;
  } catch (e) {
    return hits;
  }
}
