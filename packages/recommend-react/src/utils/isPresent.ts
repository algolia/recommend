export function isPresent<TObject>(
  value: TObject
): value is NonNullable<TObject> {
  return value !== null && value !== undefined;
}
