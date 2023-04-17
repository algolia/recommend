import {
  autocomplete,
  AutocompleteOptions,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { ProductHit } from '../../types';

let container: Root | null = null;

export function Autocomplete(props: Partial<AutocompleteOptions<ProductHit>>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!container) {
          container = createRoot(root);
        }
        container.render(children);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}

export { getAlgoliaResults };
