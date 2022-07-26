import { VNode } from '@algolia/recommend-vdom';

export type HTMLTemplate = (
  strings: TemplateStringsArray,
  ...values: any[]
) => VNode | VNode[];
