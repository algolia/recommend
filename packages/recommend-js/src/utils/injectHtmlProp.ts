import { VNode } from '@algolia/recommend-vdom';
import { html } from 'htm/preact';

export function injectHtmlProp(component: (props: any) => VNode<any>) {
  return (props: any) => component({ ...props, html });
}
