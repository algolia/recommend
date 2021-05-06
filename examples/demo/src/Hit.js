import React from 'react';

export const Hit = ({ hit, insights }) => {
  return (
    <div>
      <img src={hit.image_link} align="left" alt={hit.name} width={100} />
      <div className="hit-name">{hit.name}</div>
      <div className="hit-objectID">
        <p>
          {hit.objectID} (score={hit._recommendScore})
        </p>
      </div>
      <div className="hit-price">${hit.price}</div>
      <button
        onClick={() =>
          insights('clickedObjectIDsAfterSearch', {
            eventName: 'Product Clicked',
          })
        }
      >
        See details
      </button>
      <button
        onClick={() =>
          insights('convertedObjectIDsAfterSearch', {
            eventName: 'Product Added To Cart',
          })
        }
      >
        Add to cart
      </button>
    </div>
  );
};
