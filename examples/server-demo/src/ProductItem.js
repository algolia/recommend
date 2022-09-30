import React from 'react';

const ProductItem = ({ item }) => {
  const { name, objectID, price, image_urls } = item;

  return (
    <div style={{ maxWidth: '18%' }}>
      <img
        style={{ width: '100%', height: 'auto' }}
        src={image_urls[0]}
        alt={name}
      />
      <div>
        <h3>{name}</h3>
        <p>{objectID}</p>
        <strong>
          {price.value} {price.currency}
        </strong>
      </div>
    </div>
  );
};

export default ProductItem;
