import { PersonalizationProps } from './types';

export const isPersonalizationEnabled = (
  object: any
): object is PersonalizationProps => {
  return (
    typeof object.region !== 'undefined' &&
    typeof object.userToken !== 'undefined'
  );
};

export const getPersonalizationProps = (props: any) => {
  if (isPersonalizationEnabled(props)) {
    return {
      region: props.region,
      userToken: props.userToken,
    };
  }

  return {
    region: undefined,
    userToken: undefined,
  };
};
