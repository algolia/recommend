/** @jsxRuntime classic */
/** @jsx h */

import {
  RelatedProductsProps,
  relatedProducts as render,
} from '../relatedProducts';
import { EnvironmentProps, HTMLTemplate } from '../types';

import { Personalization } from './types';

type Props<TObject> = RelatedProductsProps<TObject, HTMLTemplate> &
  EnvironmentProps &
  Personalization;

export function relatedProducts<TObject>(props: Props<TObject>) {
  return render({
    ...props,
    experimental: {
      personalization: {
        userToken: props.userToken,
        region: props.region,
      },
    },
  });
}
