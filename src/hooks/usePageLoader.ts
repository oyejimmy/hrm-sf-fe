import { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const usePageLoader = (isLoading: boolean) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isLoading);
    return () => setLoading(false);
  }, [isLoading, setLoading]);
};