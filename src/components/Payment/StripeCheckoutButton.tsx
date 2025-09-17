import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useToast } from "../UI/ToastContainer";
import StripePaymentForm from "./StripePaymentForm";

interface StripeCheckoutButtonProps {
  amount: number;                     // required
  currency: string;                   // required
  receipt: string;                    // required
  notes?: Record<string, any>;        // optional
  onSuccess?: (result: any) => void;  // optional
  onFailure?: (error: any) => void;   // optional
  className?: string;                 // optional
  style?: React.CSSProperties;        // optional
  disabled?: boolean;                 // optional
  children?: React.ReactNode;         // optional
  loadingText?: string;               // optional
}

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  amount,
  currency,
  receipt,
  notes,
  onSuccess,
  onFailure,
  className = "",
  style,
  disabled = false,
  children,
  loadingText = "Processing...",
}) => {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { createStripePayment, isLoading } = usePaymentStore();
  const { showError } = useToast();

  const handleCheckout = async () => {
    try {
      const paymentIntent = await createStripePayment({
        amount,
        currency,
        receipt,
        notes,
      });

      setClientSecret(paymentIntent.clientSecret);
      setShowForm(true);
    } catch (err: any) {
      showError("Stripe Error", err.message || "Failed to create payment intent.");
      onFailure?.(err);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setClientSecret(null);
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={disabled || isLoading}
        className={className}
        style={style}
      >
        {isLoading ? loadingText : children || "Pay with Stripe"}
      </button>

      {showForm && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute right-3 top-2 text-2xl leading-none text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>

              {/* Payment Form */}
              <StripePaymentForm
                amount={amount}
                currency={currency}
                clientSecret={clientSecret}
                onClose={handleClose}
                onSuccess={(paymentIntent) => {
                  onSuccess?.(paymentIntent);
                  // Close the form after successful payment
                  handleClose();
                }}
                onFailure={(error) => {
                  onFailure?.(error);
                  handleClose();
                }}
              />
            </div>
          </div>
        </Elements>
      )}
    </>
  );
};

export default StripeCheckoutButton;
