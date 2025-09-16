import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { usePaymentStore } from '../../stores/usePaymentStore';
import { useToast } from '../UI/ToastContainer';

interface RazorpayCheckoutButtonProps {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any> | string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  
  // Styling options
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  
  // Button customization
  children?: React.ReactNode;
  loadingText?: string;
  
  // Razorpay-specific options
  razorpayKeyId?: string;
  companyName?: string;
  companyLogo?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay !== undefined) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  amount,
  currency,
  receipt,
  notes,
  onSuccess,
  onFailure,
  className = '',
  style,
  disabled = false,
  children,
  loadingText = 'Processing...',
  razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID,
  companyName = 'Your Company',
  companyLogo,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createRazorpayOrder, verifyRazorpayPayment, isLoading } = usePaymentStore();
  const { showSuccess, showError } = useToast();

  const handleCheckout = async () => {
    if (!razorpayKeyId) {
      const errorMsg = 'Razorpay key ID is not configured';
      showError('Configuration Error', errorMsg);
      onFailure?.(new Error(errorMsg));
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const order = await createRazorpayOrder({
        amount,
        currency,
        receipt,
        notes: typeof notes === 'string' ? notes : JSON.stringify(notes || {}),
      });

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: companyName,
        description: 'Payment Transaction',
        image: companyLogo,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationResult = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.status === 'success') {
              showSuccess('Payment Successful', 'Your payment has been processed successfully!');
              onSuccess?.(response);
            } else {
              throw new Error(verificationResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showError('Payment Verification Failed', (error as Error).message);
            onFailure?.(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: typeof notes === 'object' ? notes : { note: notes || '' },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay checkout error:', error);
      const errorMessage = (error as Error).message || 'Payment failed';
      showError('Payment Failed', errorMessage);
      onFailure?.(error);
      setIsProcessing(false);
    }
  };

  const isButtonDisabled = disabled || isLoading || isProcessing;

  const defaultClassName = `
    inline-flex items-center justify-center px-6 py-3 
    bg-gradient-to-r from-blue-500 to-cyan-600 
    text-white font-semibold rounded-lg 
    hover:from-blue-600 hover:to-cyan-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 shadow-lg hover:shadow-xl
  `.trim();

  return (
    <motion.button
      onClick={handleCheckout}
      disabled={isButtonDisabled}
      className={className || defaultClassName}
      style={style}
      whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
      whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
    >
      {isProcessing || isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {children || (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay with Razorpay
            </>
          )}
        </>
      )}
    </motion.button>
  );
};

export default RazorpayCheckoutButton;