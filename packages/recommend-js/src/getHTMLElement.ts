export function getHTMLElement(
  value: HTMLElement | string,
  environment: typeof window
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
