import { getPersonalisationAffinities } from './getPersonalisationAffinities';
import { PersonaliseRecommendations } from './types';

const p90 = (scores: number[]) => {
  scores.sort((a, b) => a - b);
  const index = Math.ceil(0.9 * scores.length);
  return scores[index - 1];
};

function calculatePosPrime({
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
}): number {
  // Calculate the minimum position within the text bucket
  const minPosInTextBucket = Math.min(...textBucket.map((r) => r.pos));

  // Calculate the power term
  const powerTerm = Math.min(1, score / p90Score);

  // Calculate the new position
  const newPos = Math.floor(pos * Math.pow((100 - impact) / 100, powerTerm));

  // Take the maximum of the minimum position in the text bucket and the calculated new position
  const posPrime = Math.max(minPosInTextBucket, newPos);

  return posPrime;
}

export async function personaliseRecommendations<TObject>({
  hits,
  ...options
}: PersonaliseRecommendations<TObject>) {
  try {
    const affinities = await getPersonalisationAffinities(options);

    const _hits = hits.map((hit) => {
      return {
        ...hit,
        filterScore: 0,
      };
    });

    Object.entries(affinities.scores).forEach(([facet, values]) => {
      Object.entries(values).forEach(([facetValue, score]) => {
        _hits.forEach((hit) => {
          if (getNestedValue(hit, facet) === facetValue) {
            hit.filterScore += score;
            //  hit._score_personalised += score; // do personalised score computation here TBD
          }
        });
      });
    });

    const scoreP90 = p90(_hits.map((hit) => hit.filterScore));

    const result = _hits
      .map((hit, index) => {
        const position = calculatePosPrime({
          pos: index,
          impact: 100,
          score: hit.filterScore,
          p90Score: scoreP90,
          textBucket: [{ pos: 0 }],
        });

        return {
          ...hit,
          position: position === 0 ? index : position,
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
          return b.filterScore - a.filterScore;
        }
        return a.position - b.position;
      });

    return result;
  } catch (e) {
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
