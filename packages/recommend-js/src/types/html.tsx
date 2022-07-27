import { VNode } from '@algolia/recommend-vdom';
import htm from 'htm';
import { createElement } from 'preact';

export const html = htm.bind<VNode>(createElement);
