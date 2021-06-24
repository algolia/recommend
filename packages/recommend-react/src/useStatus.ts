import { RecommendStatus } from '@algolia/recommend-vdom';
import { useEffect, useRef, useState } from 'react';

export function useStatus(initialStatus: RecommendStatus) {
  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [status, setStatus] = useState<RecommendStatus>(initialStatus);

  useEffect(() => {
    if (status !== 'stalled' && timerId.current) {
      clearTimeout(timerId.current);
    }

    if (status === 'loading') {
      timerId.current = setTimeout(() => {
        setStatus('stalled');
      }, 300);
    }
  }, [status]);

  return { status, setStatus };
}
