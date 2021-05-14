export function uniqBy<TItem>(key: keyof TItem, items: TItem[]) {
  return [...new Map(items.map((item) => [item[key], item])).values()];
}
