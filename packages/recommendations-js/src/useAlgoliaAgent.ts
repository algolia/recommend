import { GetRelatedProductsProps } from '@algolia/recommendations-core';
import { useEffect } from 'preact/hooks';

import { version } from './version';

type UseAlgoliaAgentProps = Pick<GetRelatedProductsProps<any>, 'searchClient'>;

export function useAlgoliaAgent(props: UseAlgoliaAgentProps) {
  useEffect(() => {
    props.searchClient.addAlgoliaAgent('recommendations-js', version);
  }, [props.searchClient]);
}
