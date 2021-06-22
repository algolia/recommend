import React from 'react';

export function Hit({ hit, insights }) {
  return (
    <a
      className="Hit Hit-link"
      href={hit.url}
      onClick={(event) => {
        event.preventDefault();

        insights('clickedObjectIDs', {
          objectIDs: [hit.objectID],
          positions: [hit.__position],
          eventName: 'Product Clicked',
          queryID: hit.__queryID,
          index: hit.__indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={hit.image_link} alt={hit.name} />
      </div>

      <div className="Hit-Content">
        <div className="Hit-Name">{hit.name}</div>
        <div className="Hit-Price">${hit.price}</div>

        <button
          className="Hit-Button"
          onClick={(event) => {
            event.preventDefault();

            insights('convertedObjectIDsAfterSearch', {
              objectIDs: [hit.objectID],
              eventName: 'Product Added To Cart',
              queryID: hit.__queryID,
              index: hit.__indexName,
            });
          }}
        >
          Add to cart
        </button>
      </div>
    </a>
  );
}
