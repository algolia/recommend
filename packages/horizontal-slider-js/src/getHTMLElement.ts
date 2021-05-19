export function getHTMLElement(
  value: string | HTMLElement,
  environment: typeof window
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
