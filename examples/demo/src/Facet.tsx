import React from 'react';

import './Facet.css';
import { FacetProps } from './types';

export function Facet({ hit, insights, onSelect, indexName }: FacetProps) {
  return (
    <div
      className="Hit"
      role="button"
      tabIndex={-1}
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedFilters', {
          filters: [`${hit.facetName}:${hit.facetValue}`],
          eventName: 'Facet Clicked',
          index: indexName,
        });
      }}
    >
      <div className="Facet-Content">
        <div className="Facet-Value">{hit.facetValue}</div>
      </div>
    </div>
  );
}
