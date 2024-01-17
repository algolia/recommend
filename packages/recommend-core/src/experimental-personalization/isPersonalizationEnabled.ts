import { PersonalizationProps } from './types';

export const isPersonalizationEnabled = (
  object: any
): object is PersonalizationProps => {
  return (
    (object.region === 'eu' || object.region === 'us') &&
    typeof object.userToken === 'string'
  );
};
