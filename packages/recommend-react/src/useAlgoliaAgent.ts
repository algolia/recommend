import { GetRelatedProductsProps } from '@algolia/recommend-core';
import { useEffect } from 'react';

import { version } from './version';

type UseAlgoliaAgentProps = Pick<
  GetRelatedProductsProps<any>,
  'recommendClient'
>;

export function useAlgoliaAgent(props: UseAlgoliaAgentProps) {
  useEffect(() => {
    props.recommendClient.addAlgoliaAgent('recommend-react', version);
  }, [props.recommendClient]);
}
