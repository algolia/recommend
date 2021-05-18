export function getHTMLElement(
  value: string | HTMLElement,
  environment: typeof window = window
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
