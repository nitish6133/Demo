// App.tsx
import RazorpayPaymentForm from "./components/RazorpayPaymentForm";
import { serviceBaseUrl } from "./constants/appConstants";

function App() {
  return (
    <RazorpayPaymentForm
      backendUrl={serviceBaseUrl}
      razorpayKeyId={import.meta.env.VITE_RAZORPAY_KEY_ID as string}
    />
  );
}

export default App;
