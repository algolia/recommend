import React from 'react';

const ProductItem = ({ item }) => {
  const { name, objectID, price, image_urls } = item;

  return (
    <>
      <h3>{name}</h3>
      <div>
        {/*<img src={image_urls[0]} alt={name} />*/}
        <p>{objectID}</p>
        <strong>
          {price.value} {price.currency}
        </strong>
      </div>
    </>
  );
};

export default ProductItem;
