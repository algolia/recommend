import React from 'react';
import { InsightsClient } from 'search-insights';

import { FacetHit } from '../../types';

import './style.css';

type FacetProps = {
  hit: FacetHit;
  indexName: string;
  insights: InsightsClient;
  onSelect(hit: FacetHit): void;
};

export function Facet({ hit, onSelect, indexName, insights }: FacetProps) {
  return (
    <div
      className="Hit"
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedFilters', {
          index: indexName,
          eventName: 'Facet Clicked',
          filters: [`${hit.facetName}:${hit.facetValue}`],
        });
      }}
    >
      <div className="Facet-Content">
        <div className="Facet-Value">{hit.facetValue}</div>
      </div>
    </div>
  );
}
