import { useEffect, useRef } from 'react';

type Props = Record<string, any>;
type AlteredProps<TProps> = Partial<{ [TProp in keyof TProps]: any }>;

function isPrimitive(obj: any) {
  return Object(obj) !== obj;
}

function separatePrimitives<TProps>(props: TProps) {
  const primitives = Object.entries(props).reduce<TProps>((prev, [k, v]) => {
    if (isPrimitive(v)) {
      return {
        ...prev,
        [k]: v,
      };
    }

    return prev;
  }, {} as TProps);
  const nonPrimitives = Object.entries(props).reduce<TProps>((prev, [k, v]) => {
    if (!isPrimitive(v)) {
      return {
        ...prev,
        [k]: v,
      };
    }

    return prev;
  }, {} as TProps);

  return { primitives, nonPrimitives };
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
