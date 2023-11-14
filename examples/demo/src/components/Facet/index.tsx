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
  const userToken = React.useRef<any>('');
  insights('getUserToken', {}, (_err, token) => (userToken.current = token));

  return (
    <div
      className="Hit"
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedFilters', {
          userToken: userToken.current,
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
