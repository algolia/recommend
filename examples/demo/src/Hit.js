import React from 'react';

export function Hit({ hit, insights }) {
  return (
    <div className="RecommendationItem">
      <div className="RecommendationItemImage">
        <img src={hit.image_link} alt={hit.name} />
      </div>

      <div>
        <div className="RecommendationItemName">{hit.name}</div>
        <div className="RecommendationItemDescription">
          <p>
            {hit.objectID} (score: {hit.__recommendScore})
          </p>
        </div>
        <div className="RecommendationItemPrice">${hit.price}</div>
      </div>

      <div>
        <button
          onClick={() =>
            insights('clickedObjectIDsAfterSearch', {
              objectIDs: [hit.objectID],
              eventName: 'Product Clicked',
              queryID: hit.__queryID,
              index: hit.__indexName,
            })
          }
        >
          See details
        </button>
        <button
          onClick={() =>
            insights('convertedObjectIDsAfterSearch', {
              objectIDs: [hit.objectID],
              eventName: 'Product Added To Cart',
              queryID: hit.__queryID,
              index: hit.__indexName,
            })
          }
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
