import { GetRelatedProductsProps } from '@algolia/recommend-core';
import { useEffect } from 'react';

import { version } from './version';

type UseAlgoliaAgentProps = Pick<
  GetRelatedProductsProps<any>,
  'recommendClient' | 'initialState'
>;

export function useAlgoliaAgent(props: UseAlgoliaAgentProps) {
  useEffect(() => {
    if (props.initialState) {
      props.recommendClient.addAlgoliaAgent('recommend-server', version);
    } else {
      props.recommendClient.addAlgoliaAgent('recommend-react', version);
    }
  }, [props.recommendClient, props.initialState]);
}
