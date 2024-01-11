/** @jsxRuntime classic */
/** @jsx h */
import {
  LookingSimilarProps,
  lookingSimilar as render,
} from '../lookingSimilar';
import { EnvironmentProps, HTMLTemplate } from '../types';

import { Personalization } from './types';

type Props<TObject> = LookingSimilarProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function lookingSimilar<TObject>(props: Props<TObject>) {
  return render<TObject>({
    ...props,
    experimental: {
      personalization: {
        userToken: props.userToken,
        region: props.region,
      },
    },
  });
}
