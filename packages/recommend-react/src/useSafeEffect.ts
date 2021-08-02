import { useEffect, useRef } from 'react';

type Props = Record<string, any>;
type AlteredProps<TProps> = Partial<{ [TProp in keyof TProps]: any }>;

function isPrimitive(obj: any) {
  return Object(obj) !== obj;
}

function separatePrimitives<TProps>(props: TProps) {
  return Object.entries(props).reduce<{
    primitives: TProps;
    nonPrimitives: TProps;
  }>(
    (prev, [k, v]) => {
      if (isPrimitive(v)) {
        prev.primitives[k] = v;
      } else {
        prev.nonPrimitives[k] = v;
      }
      return prev;
    },
    {
      primitives: ({} as const) as TProps,
      nonPrimitives: ({} as const) as TProps,
    }
  );
}

export function useSafeEffect<TProps = Props>(
  cb: (props: TProps) => void,
  props: TProps,
  alteredProps: AlteredProps<TProps> = props
) {
  const { nonPrimitives, primitives } = separatePrimitives({
    ...props,
    ...alteredProps,
  });
  const nonPrimitivesRef = useRef(nonPrimitives);

  // we always keep the non-primitive variables up to date
  useEffect(() => {
    nonPrimitivesRef.current = nonPrimitives;
  });

  useEffect(
    () => cb({ ...props, ...nonPrimitivesRef.current }),
    Object.values(primitives)
  );
}
