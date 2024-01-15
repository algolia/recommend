import { isPersonalized } from '@algolia/recommend-core/src/personalization';

export const getPersonalizedParams = (params: any) => {
  if (isPersonalized(params)) {
    return { region: params.region, userToken: params.userToken };
  }
  return { region: undefined, userToken: undefined };
};
