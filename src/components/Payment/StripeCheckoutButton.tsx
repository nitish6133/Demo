import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useToast } from "../UI/ToastContainer";
import StripePaymentForm from "./StripePaymentForm";

interface StripeCheckoutButtonProps {
  amount: number;                 // required
  currency: string;               // required
  receipt: string;                // required
  notes?: Record<string, any>;    // optional
  onSuccess?: (result: any) => void; // optional
  onFailure?: (error: any) => void;  // optional
  className?: string;                 // optional
  style?: React.CSSProperties;        // optional
  disabled?: boolean;                 // optional
  children?: React.ReactNode;         // optional
  loadingText?: string;               // optional
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

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
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formCurrency, setFormCurrency] = useState<string>("");

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
      setFormAmount(paymentIntent.amount);
      setFormCurrency(paymentIntent.currency);
      setShowForm(true);
    } catch (err: any) {
      showError("Stripe Error", err.message || "Failed to create payment intent.");
      onFailure?.(err);
    }
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
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow w-full max-w-md relative">
              <button onClick={() => setShowForm(false)} className="absolute top-2 right-3 text-xl">×</button>
              <StripePaymentForm
                amount={formAmount}
                currency={formCurrency}
                clientSecret={clientSecret}
                onSuccess={(paymentIntent) => {
                  setShowForm(false);
                  onSuccess?.(paymentIntent);
                }}
                onFailure={(error) => {
                  setShowForm(false);
                  onFailure?.(error);
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
