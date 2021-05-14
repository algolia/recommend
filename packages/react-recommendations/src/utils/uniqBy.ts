export function uniqBy<TObject>(key: keyof TObject, objects: TObject[]) {
  return [...new Map(objects.map((item) => [item[key], item])).values()];
}
