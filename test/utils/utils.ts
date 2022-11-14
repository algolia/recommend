export const getItemName = (items) => {
  return items.map((item) => {
    return item.name;
  });
};

export const getItemPrice = (items) => {
  return items.map((item) => {
    return item.price;
  });
};
