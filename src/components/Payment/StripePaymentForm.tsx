import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useToast } from "../UI/ToastContainer";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess?: (result: any) => void;
  onFailure?: (error: any) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showError } = useToast();

  const [postalCode, setPostalCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      showError("Card Error", "Card details not entered.");
      return;
    }

    if (postalCode.trim() === "") {
      showError("Validation Error", "Postal code is required.");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {
              postal_code: postalCode.trim(),
            },
          },
        },
      });

      if (error) {
        showError("Payment Failed", error.message || "Payment failed.");
        onFailure?.(error);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess?.(paymentIntent);
      } else {
        showError("Payment Failed", `Payment status: ${paymentIntent?.status}`);
        onFailure?.(paymentIntent);
      }
    } catch (err: any) {
      showError("Payment Failed", err.message || "Payment failed.");
      onFailure?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="card-element" className="block mb-1 font-medium">
          Card Details
        </label>
        <div className="p-2 border rounded">
          <CardElement id="card-element" options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div>
        <label htmlFor="postal-code" className="block mb-1 font-medium">
          Postal Code
        </label>
        <input
          id="postal-code"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter postal code"
          required
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
