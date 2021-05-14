type Predicate<TITem> = (a: TITem, b: TITem) => number;

export function sortBy<TITem>(predicate: Predicate<TITem>, items: TITem[]) {
  const itemsCopy = [...items];
  itemsCopy.sort(predicate);

  return itemsCopy;
}
