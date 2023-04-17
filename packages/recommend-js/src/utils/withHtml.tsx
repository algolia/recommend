/** @jsx h */
import { html } from 'htm/preact';
import { h } from 'preact';

import { HTMLTemplate } from '../types';

export function withHtml<TProps>(
  Component: preact.FunctionComponent<TProps>
): (props: HTMLTemplate & TProps) => JSX.Element {
  const ComponentWithHtml = (props: TProps) => (
    <Component {...props} html={html} />
  );

  if (__DEV__) {
    ComponentWithHtml.displayName = `withHtml(${Component.displayName})`;
  }

  return ComponentWithHtml;
}
