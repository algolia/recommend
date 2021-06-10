type Predicate<TItem> = (a: TItem, b: TItem) => number;

export function sortBy<TItem>(predicate: Predicate<TItem>, items: TItem[]) {
  const itemsCopy = [...items];
  itemsCopy.sort(predicate);

  return itemsCopy;
}
