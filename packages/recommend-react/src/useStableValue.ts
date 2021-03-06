import { dequal } from 'dequal/lite';
import { useEffect, useState } from 'react';

export function useStableValue<TValue>(value: TValue) {
  const [stableValue, setStableValue] = useState<TValue>(() => value);

  useEffect(() => {
    if (dequal(stableValue, value) === false) {
      setStableValue(value);
    }

    // We only want to trigger the effect when `value` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return stableValue;
}
