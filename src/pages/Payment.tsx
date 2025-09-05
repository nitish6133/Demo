/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/UI/Button";
import { pujaService } from "../services/pujaService";
import { useToast } from "../components/UI/ToastContainer";
import PaymentSuccessModal from "../components/Checkout/PaymentSuccessModal";
import PaymentFailureModal from "../components/Checkout/PaymentFailureModal";
import { formatMoney } from "../constants/pricing";
import { formatBackendDateForDisplay } from "../utils/dateUtils";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay !== undefined) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [discountInlineMessage, setDiscountInlineMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    amount: number;
    currency: string;
    orderId: string;
    paymentId: string;
  } | null>(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureInfo, setFailureInfo] = useState<{
    title?: string;
    message: string;
    reason?: string;
    orderId?: string;
    paymentId?: string;
    errorCode?: string | number;
  } | null>(null);





  // Calculate base total (base price + additional families)




  const isINR = selectedCurrency === 'INR';

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setFailureInfo({
          title: "Payment Setup Failed",
          message: "We couldn't load the payment gateway.",
          reason:
            "The Razorpay script failed to load. Please check your internet connection and try again.",
        });
        setShowFailureModal(true);
        return; // stays on payment page
      }
      // Create booking
      const orderData: any = await pujaService.createPaymentByRazorpay({
        amount: finalTotal * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user?.id || "guest",
          userEmail: user?.email || "guest@example.com",
        },
      });

      console.log("Order data from backend:", orderData);

      // Prefer runtime-injected env (window.__ENV__) and fallback to build-time Vite env
      const runtimeEnv = (window as any).__ENV__ || {};
      const razorpayKey =
        runtimeEnv.VITE_RAZORPAY_KEY_ID ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        "NO_KEY_ID";

      const options = {
        key: razorpayKey,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "AI Pujari",
        description: "Test Transaction",
        order_id: orderData.data.orderId,
        handler: async (response: any) => {
          try {
            console.log("Payment response:", response);
            if (!response || !response.razorpay_order_id) {
              setFailureInfo({
                message: "Invalid payment response received.",
                reason:
                  "The payment gateway did not return a valid order reference.",
                paymentId: response?.razorpay_payment_id,
              });
              setShowFailureModal(true);
              return; // keep user on page
            }

            let verificationResult = await pujaService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // If signature verification fails, fallback to check order status from backend
            if (verificationResult?.status !== "success") {
              const orderStatusResult = await pujaService.getOrderDetails(orderData.data.id);

              if (
                orderStatusResult?.status === "paid" ||
                orderStatusResult?.status === "captured"
              ) {
                // Treat payment as successful based on order status in backend
                verificationResult = { status: "success" };
              } else {
                verificationResult = {
                  status: "failed",
                  message:
                    "Payment verification and order status check failed.",
                };
              }
            }

            if (verificationResult?.status === "success") {
              setSuccessInfo({
                amount: Math.round(orderData.data.amount / 100),
                currency: orderData.data.currency || "INR",
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
              setShowSuccessModal(true);
            } else {
              setFailureInfo({
                title: "Verification Failed",
                message: "We couldn't verify your payment.",
                reason:
                  verificationResult?.message ||
                  "Signature mismatch or timeout during verification.",
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
              setShowFailureModal(true);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setFailureInfo({
              title: "Verification Error",
              message: "An error occurred while verifying your payment.",
              reason:
                (error as any)?.message ||
                "A network or server error interrupted verification.",
            });
            setShowFailureModal(true);
          }
        },
        theme: {
          color: "var(--color-theme-primary)",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user");
            // Don't show error for user cancellation
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      console.log("Booking created:", options);
    } catch (error) {
      console.error("Payment failed:", error);
      setFailureInfo({
        message: "Something went wrong while initiating your payment.",
        reason: (error as any)?.message || "Unexpected client error.",
      });
      setShowFailureModal(true);
    } finally {
      setIsProcessing(false);
    }
  };















  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 p-8">
            <div className="flex items-center mb-6">
              <Button
                onClick={() => navigate("/booking")}
                variant="ghost"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                Payment Summary
              </h1>
            </div>







          </div>

          {/* Payment Methods */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Payment Method
            </h2>

            <div className="mb-6 p-4 border-2 rounded-lg bg-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {isINR ? 'Razorpay' : 'Stripe'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isINR ? 'UPI, Cards, Net Banking & Wallets' : 'Cards and Wallets'}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">
                {isINR ? 'INR' : selectedCurrency}
              </span>
            </div>

            {isINR ? (
              <Button
                onClick={handleRazorpayPayment}
                loading={isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ${formatMoney(finalTotal, selectedCurrency)} with Razorpay`}
              </Button>
            ) : (
              <></>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>

        {showSuccessModal && successInfo && (
          <PaymentSuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              navigate("/booking");
            }}
            amount={successInfo.amount}
            currency={successInfo.currency}
            orderId={successInfo.orderId}
            paymentId={successInfo.paymentId}
            email={user?.email || ""}
            onViewBooking={handleViewBooking}
            onGoHome={handleGoHome}
            onDownloadReceipt={handleDownloadReceipt}
          />
        )}

        {showFailureModal && failureInfo && (
          <PaymentFailureModal
            isOpen={showFailureModal}
            onClose={() => setShowFailureModal(false)}
            title={failureInfo.title}
            message={failureInfo.message}
            reason={failureInfo.reason}
            orderId={failureInfo.orderId}
            paymentId={failureInfo.paymentId}
            errorCode={failureInfo.errorCode}
            email={user?.email || ""}
          />
        )}
      </div>
  );
};

export default Payment;
