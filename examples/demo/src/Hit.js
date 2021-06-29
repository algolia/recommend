import React from 'react';

export function Hit({ hit, insights }) {
  return (
    <a
      className="Hit"
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
        {hit._score && (
          <div className="Hit-Score">
            <svg className="inline-block mr-1" width="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.984 9.984h2.016v4.031h-2.016v-4.031zM15 18v-12h2.016v12h-2.016zM3 14.016v-4.031h2.016v4.031h-2.016zM11.016 21.984v-19.969h1.969v19.969h-1.969zM6.984 18v-12h2.016v12h-2.016z"
              ></path>
            </svg>
            {hit._score}
          </div>
        )}
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
