import {
  ProductBaseRecord,
  Recommendations,
  RecommendationsProps as RecommendationsComponentProps,
} from '@algolia/react-recommendations';
import React, { render } from 'preact/compat';

import { getHTMLElement } from './getHTMLElement';

interface RecommendationsProps<TObject extends ProductBaseRecord>
  extends RecommendationsComponentProps<TObject> {
  container: string | HTMLElement;
  environment?: typeof window;
}

export function recommendations<TObject extends ProductBaseRecord>({
  container,
  environment,
  ...rest
}: RecommendationsProps<TObject>) {
  render(<Recommendations {...rest} />, getHTMLElement(container, environment));
}
