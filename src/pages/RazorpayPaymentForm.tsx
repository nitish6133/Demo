import React, { useState } from 'react';
import type { PaymentFormData, RazorpayPaymentFormProps } from '../types/razorpayTypes';
import { createRazorpayService } from '../services/razorpayService';

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

const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({
  backendUrl,
  razorpayKeyId,
  className = '',
  formClassName = '',
  inputClassName = '',
  buttonClassName = '',
  labelClassName = '',
  errorClassName = '',
  amountLabel = 'Amount',
  currencyLabel = 'Currency',
  receiptLabel = 'Receipt',
  notesLabel = 'Notes',
  submitButtonText = 'Pay Now',
  amountPlaceholder = 'Enter amount',
  currencyPlaceholder = 'INR',
  receiptPlaceholder = 'Enter receipt number',
  notesPlaceholder = 'Enter notes (optional)',
  defaultCurrency = 'INR',
  defaultAmount,
  onPaymentSuccess,
  onPaymentFailure,
  onOrderCreated,
  onFormSubmit,
  validateForm,
  loadingText = 'Processing...',
  style,
  inputStyle,
  buttonStyle,
  labelStyle,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: defaultAmount || 0,
    currency: defaultCurrency,
    receipt: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const razorpayService = createRazorpayService(backendUrl);

  const handleInputChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Custom validation
    if (validateForm) {
      const validationError = validateForm(formData);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Basic validation
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.currency) {
      setError('Please enter a currency');
      return;
    }
    if (!formData.receipt) {
      setError('Please enter a receipt number');
      return;
    }

    setIsLoading(true);
    onFormSubmit?.(formData);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const orderResponse = await razorpayService.createPaymentByRazorpay({
        amount: formData.amount * 100, // Convert to paise
        currency: formData.currency,
        receipt: formData.receipt,
        notes: formData.notes,
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      onOrderCreated?.(orderResponse);

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Payment',
        description: 'Payment Transaction',
        order_id: orderResponse.data.orderId,
        handler: async (response: any) => {
          try {
            const verificationResult = await razorpayService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.status === 'success') {
              onPaymentSuccess?.(response);
            } else {
              throw new Error(verificationResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onPaymentFailure?.(error);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      setError((error as Error).message);
      onPaymentFailure?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStyles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      ...labelStyle,
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      ...inputStyle,
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ...buttonStyle,
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '4px',
    },
  };

  return (
    <div className={className} style={{ ...defaultStyles.container, ...style }}>
      <form 
        className={formClassName} 
        style={defaultStyles.form} 
        onSubmit={handleSubmit}
      >
        <div style={defaultStyles.field}>
          <label className={labelClassName} style={defaultStyles.label}>
            {amountLabel}
          </label>
          <input
            type="number"
            className={inputClassName}
            style={defaultStyles.input}
            placeholder={amountPlaceholder}
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            required
            min="1"
            step="0.01"
          />
        </div>

        <div style={defaultStyles.field}>
          <label className={labelClassName} style={defaultStyles.label}>
            {currencyLabel}
          </label>
          <input
            type="text"
            className={inputClassName}
            style={defaultStyles.input}
            placeholder={currencyPlaceholder}
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            required
          />
        </div>

        <div style={defaultStyles.field}>
          <label className={labelClassName} style={defaultStyles.label}>
            {receiptLabel}
          </label>
          <input
            type="text"
            className={inputClassName}
            style={defaultStyles.input}
            placeholder={receiptPlaceholder}
            value={formData.receipt}
            onChange={(e) => handleInputChange('receipt', e.target.value)}
            required
          />
        </div>

        <div style={defaultStyles.field}>
          <label className={labelClassName} style={defaultStyles.label}>
            {notesLabel}
          </label>
          <textarea
            className={inputClassName}
            style={{ ...defaultStyles.input, minHeight: '80px', resize: 'vertical' }}
            placeholder={notesPlaceholder}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <div className={errorClassName} style={defaultStyles.error}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className={buttonClassName}
          style={{
            ...defaultStyles.button,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          disabled={isLoading}
        >
          {isLoading ? loadingText : submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default RazorpayPaymentForm;