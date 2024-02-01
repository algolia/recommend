import { getAffinities } from './getAffinities';
import { getStrategy } from './getStrategy';

type GetPersonalizationFilters = {
  userToken: string;
  region: string;
  apiKey: string;
  appId: string;
};

export const getPersonalizationFilters = async ({
  userToken,
  region,
  apiKey,
  appId,
}: GetPersonalizationFilters) => {
  if (!region) {
    throw new Error(
      '[Algolia Recommend] parameter `region` is required to enable personalization.'
    );
  }
  if (!userToken) {
    // eslint-disable-next-line no-console
    console.warn(
      "[Algolia Recommend] Personalization couldn't be enabled because `userToken` is missing. Falling back to non-personalized recommendations."
    );
    return [];
  }

  try {
    const [affinities, strategy] = await Promise.all([
      getAffinities({ userToken, apiKey, appId, region }),
      getStrategy({ apiKey, appId, region }),
    ]);

    const FALLBACK_WEIGHT = 100;
    const facetsScoringMap = new Map(
      strategy.facetsScoring.map((value) => [value.facetName, value.score])
    );

    const optionalFilters = Object.entries(affinities.scores).flatMap(
      ([facet, values]) =>
        Object.entries(values).map(([value, score]) => {
          const weight = facetsScoringMap.get(facet) ?? FALLBACK_WEIGHT;
          const weightedScore = Math.floor(score * (weight / 100));
          return `${facet}:${value}<score=${weightedScore}>`;
        })
    );

    return optionalFilters;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error(
      `[Algolia Recommend] Personalization couldn't be enabled. Falling back to non-personalized recommendations. Error: ${errorMessage}`
    );
    return [];
  }
};
