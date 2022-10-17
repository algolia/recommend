import {
  GetRelatedProductsProps,
  InitialResults,
} from '@algolia/recommend-core';
import { useEffect } from 'react';

import { version } from './version';

type UseAlgoliaAgentProps = Pick<
  GetRelatedProductsProps<any>,
  'recommendClient'
>;

export function useAlgoliaAgent(
  props: UseAlgoliaAgentProps & { initialState?: InitialResults<any> }
) {
  useEffect(() => {
    if (props.initialState) {
      props.recommendClient.addAlgoliaAgent('recommend-server', version);
    }
    props.recommendClient.addAlgoliaAgent('recommend-react', version);
  }, [props.recommendClient, props.initialState]);
}
