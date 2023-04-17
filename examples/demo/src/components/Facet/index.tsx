import React from 'react';
import { InsightsClient } from 'search-insights';

import { FacetHit } from '../../types';

import './style.css';

type FacetProps = {
  hit: FacetHit;
  indexName: string;
  insights: InsightsClient;
  onSelect: (hit: FacetHit) => void;
};

export function Facet({ hit, onSelect, indexName, insights }: FacetProps) {
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
