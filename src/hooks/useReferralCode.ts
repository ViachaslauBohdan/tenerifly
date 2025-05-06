import { useEffect } from 'react';

export function useReferralCode() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref_code');
    if (refCode) {
      localStorage.setItem('ref_code', refCode);
    }
  }, []);
} 