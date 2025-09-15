export interface PaymentFormData {
  amount: number;
  currency: string;
  receipt: string;
  notes: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  data?: {
    id: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret: string;
    [key: string]: any;
  };
  error?: string;
}

export interface VerificationResponse {
  success: boolean;
  data?: {
    paymentIntentId: string;
    status: string;
    amount: number;
    currency: string;
    [key: string]: any;
  };
  error?: string;
}

export interface PaymentSuccessResponse {
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
}

export interface StripePaymentFormProps {
  // Backend configuration
  backendUrl: string;
  stripePublishableKey: string;
  
  // Form customization
  className?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  
  // Field customization
  amountLabel?: string;
  currencyLabel?: string;
  receiptLabel?: string;
  notesLabel?: string;
  submitButtonText?: string;
  
  // Placeholders
  amountPlaceholder?: string;
  currencyPlaceholder?: string;
  receiptPlaceholder?: string;
  notesPlaceholder?: string;
  
  // Default values
  defaultCurrency?: string;
  defaultAmount?: number;
  
  // Callbacks
  onPaymentSuccess?: (response: PaymentSuccessResponse) => void;
  onPaymentFailure?: (error: any) => void;
  onPaymentIntentCreated?: (intent: PaymentIntentResponse) => void;
  onFormSubmit?: (data: PaymentFormData) => void;
  
  // Validation
  validateForm?: (data: PaymentFormData) => string | null;
  
  // Loading states
  loadingText?: string;
  
  // Styling options
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}