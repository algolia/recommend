import { dequal } from 'dequal/lite';
import { useEffect, useState } from 'react';

export function useDeepComparedValue<TValue>(value: TValue) {
  const [lastValue, setLastValue] = useState<TValue>(() => value);

  useEffect(() => {
    if (dequal(lastValue, value) === false) {
      setLastValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return lastValue;
}
