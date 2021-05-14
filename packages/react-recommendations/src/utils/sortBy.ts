type Predicate<TObject> = (a: TObject, b: TObject) => number;

export function sortBy<TObject>(
  predicate: Predicate<TObject>,
  objects: TObject[]
) {
  const objectsCopy = [...objects];
  objectsCopy.sort(predicate);

  return objectsCopy;
}
