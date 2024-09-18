import { useEffect, useRef } from 'react';

function useInfiniteScroll(callback: () => void) {
  const observer = useRef<IntersectionObserver | null>(null);
  const triggerElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (triggerElement.current) {
      observer.current.observe(triggerElement.current);
    }

    return () => {
      if (triggerElement.current && observer.current) {
        observer.current.unobserve(triggerElement.current);
      }
    };
  }, [callback]);

  return triggerElement;
}

export default useInfiniteScroll;
