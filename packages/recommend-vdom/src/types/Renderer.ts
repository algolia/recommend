export type Pragma = (
  type: any,
  props: Record<string, any> | null,
  ...children: ComponentChildren[]
) => JSX.Element;

export type PragmaFrag = any;

type ComponentChild =
  | VNode<any>
  | boolean
  | number
  | object
  | string
  | null
  | undefined;

type ComponentChildren = ComponentChild | ComponentChild[];

export type VNode<TProps = any> = {
  type: any;
  key: any | number | string;
  props: TProps & { children: ComponentChildren; key?: any };
};

export type Renderer = {
  /**
   * The function to create virtual nodes.
   *
   * @default preact.createElement
   */
  createElement: Pragma;
  /**
   * The component to use to create fragments.
   *
   * @default preact.Fragment
   */
  Fragment: PragmaFrag;
};
