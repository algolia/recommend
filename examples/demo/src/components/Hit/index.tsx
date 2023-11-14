import React, { useEffect } from 'react';
import { InsightsClient } from 'search-insights';

import { indexName } from '../../config';
import { ProductHit } from '../../types';
import './style.css';
import { ButtonComponent } from '../common';

type HitProps = {
  hit: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};

export function Hit({ hit, onSelect, insights }: HitProps) {
  const userToken = React.useRef<any>('');
  insights('getUserToken', {}, (_err, token) => (userToken.current = token));

  useEffect(() => {
    insights('viewedObjectIDs', {
      eventName: 'Product Viewed',
      userToken: userToken.current,
      objectIDs: [hit.objectID],
      index: indexName,
    });
  }, [hit.objectID, insights]);

  return (
    <a
      className="Hit Hit-link"
      href={hit.url}
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedObjectIDs', {
          userToken: userToken.current,
          objectIDs: [hit.objectID],
          eventName: 'Product Clicked',
          index: indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={hit.image_urls[0]} alt={hit.name} className="product-image" />
      </div>

      <div className="Hit-Content">
        <div className="Hit-Name">{hit.name}</div>
        <div className="Hit-Description">{hit.objectID}</div>

        <div className="Hit-Price">${hit.price.value}</div>
        <ButtonComponent
          label="Add to cart"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            insights('convertedObjectIDsAfterSearch', {
              userToken: userToken.current,
              eventName: 'Product Added To Cart',
              objectIDs: [hit.objectID],
              index: indexName,
              queryID: hit.__queryID,
            });
          }}
        />
      </div>
    </a>
  );
}
