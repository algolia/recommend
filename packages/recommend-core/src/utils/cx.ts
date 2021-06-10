export function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}
