
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RazorpayButtonProps {
  amount: number;
  productName: string;
  productDescription: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
  customerId?: string;
  className?: string;
  disabled?: boolean;
  buttonText?: string;
}

// NOTE: This is just a client-side Razorpay integration skeleton
// In a real application, you'd need a backend to create orders and verify signatures
export function RazorpayButton({
  amount,
  productName,
  productDescription,
  onSuccess,
  onError,
  customerId,
  className,
  disabled = false,
  buttonText = "Pay Now"
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // This should be initialized properly with your Razorpay key from environment variables
  const razorpayKeyId = "YOUR_RAZORPAY_KEY_ID"; // This should be replaced with your actual key
  
  const handlePayment = () => {
    setLoading(true);
    
    // In a real implementation, you would fetch an order ID from your backend
    // For demo purposes, we'll simulate this
    setTimeout(() => {
      try {
        if (!(window as any).Razorpay) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Razorpay SDK failed to load. Please try again later.",
          });
          setLoading(false);
          if (onError) onError(new Error("Razorpay SDK failed to load"));
          return;
        }
        
        // This is a minimal configuration
        // In a real app, orderId, receipt, etc. would come from your backend
        const options = {
          key: razorpayKeyId,
          amount: amount * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "Grew up",
          description: productDescription,
          prefill: {
            email: "", // would be filled with user's email
            contact: "", // would be filled with user's contact
          },
          theme: {
            color: "#7c3aed", // Use your brand color
          },
          handler: function(response: any) {
            // Handle successful payment
            setLoading(false);
            toast({
              title: "Payment Successful",
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            if (onSuccess) onSuccess(response);
          },
        };
        
        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.on('payment.failed', function(response: any) {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: response.error.description,
          });
          if (onError) onError(response.error);
        });
        
        razorpayInstance.open();
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong with the payment.",
        });
        if (onError) onError(error);
      }
    }, 1000); // Simulate network request delay
  };
  
  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <>Processing...</>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
}
