
import { useEffect, useState } from 'react';

export default function RazorpayInit() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully');
        setLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      setLoaded(true);
    }
  }, []);

  return null;
}
