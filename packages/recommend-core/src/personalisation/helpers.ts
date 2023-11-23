import { ProductRecord } from '../types';

import { UserProfileResponse } from './neural/types';
import { Hits } from './types';
import { StrategyResponse } from './v1/getPersonalisationStrategy';
import { AffinitiesResponse } from './v1/types';

export const mapProfileToAffinities = (
  profile: UserProfileResponse
): AffinitiesResponse => {
  const scores: AffinitiesResponse['scores'] = {};

  profile.affinities.forEach((affinity) => {
    if (!scores[affinity.name]) {
      scores[affinity.name] = {};
    }
    scores[affinity.name][affinity.value] = affinity.score;
  });

  return {
    lastEventAt: profile.lastUpdatedAt,
    userToken: profile.userID,
    scores,
  };
};

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

export function applyAffinities<TObject>(
  affinities: AffinitiesResponse,
  strategy: StrategyResponse | null,
  hits: Hits<TObject>
) {
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
            strategy?.facetsScoring?.find((value) => value.facetName === facet)
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
    })
    .map((_hit, index) => {
      let filtersScore = 0;
      for (let i = 0; i < hits.length; i++) {
        const hit = hits[i];
        if (hit.objectID === _hit.objectID) {
          // compute fake filterScore to highlighted personalization effect in the UI
          filtersScore = index !== i ? 42 : 0;
          break;
        }
      }
      // @ts-expect-error
      _hit._rankingInfo = {
        personalization: {
          filtersScore,
        },
      };
      return _hit;
    });

  return result;
}
