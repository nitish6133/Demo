# Razorpay Payment Form

A fully customizable React component for Razorpay payments with TypeScript support.

## Features

- 🎨 **Fully Customizable** - Style every element with CSS classes or inline styles
- 🔧 **Dynamic Backend URL** - Configure backend endpoint at runtime
- 📝 **Simple Form** - Just 4 essential fields: amount, currency, receipt, notes
- 🔒 **Built-in Services** - Includes createPaymentByRazorpay, verifyPayment, getOrderDetails
- 📱 **Responsive** - Works on all device sizes
- 🎯 **TypeScript** - Full type safety and IntelliSense support
- 🚀 **Easy Integration** - Drop-in component for any React project

## Installation

```bash
npm install @your-org/razorpay-payment-form
```

## Quick Start

```tsx
import React from 'react';
import { RazorpayPaymentForm } from '@your-org/razorpay-payment-form';
import '@your-org/razorpay-payment-form/styles';

function App() {
  return (
    <RazorpayPaymentForm
      backendUrl="https://your-api.com/api"
      razorpayKeyId="rzp_test_your_key_id"
      onPaymentSuccess={(response) => {
        console.log('Payment successful:', response);
      }}
      onPaymentFailure={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `backendUrl` | `string` | Your backend API base URL |
| `razorpayKeyId` | `string` | Your Razorpay key ID |

### Styling Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | CSS class for the container |
| `formClassName` | `string` | CSS class for the form |
| `inputClassName` | `string` | CSS class for input fields |
| `buttonClassName` | `string` | CSS class for the submit button |
| `labelClassName` | `string` | CSS class for labels |
| `errorClassName` | `string` | CSS class for error messages |
| `style` | `CSSProperties` | Inline styles for container |
| `inputStyle` | `CSSProperties` | Inline styles for inputs |
| `buttonStyle` | `CSSProperties` | Inline styles for button |
| `labelStyle` | `CSSProperties` | Inline styles for labels |

### Customization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amountLabel` | `string` | `"Amount"` | Label for amount field |
| `currencyLabel` | `string` | `"Currency"` | Label for currency field |
| `receiptLabel` | `string` | `"Receipt"` | Label for receipt field |
| `notesLabel` | `string` | `"Notes"` | Label for notes field |
| `submitButtonText` | `string` | `"Pay Now"` | Submit button text |
| `loadingText` | `string` | `"Processing..."` | Loading state text |
| `defaultCurrency` | `string` | `"INR"` | Default currency value |
| `defaultAmount` | `number` | `undefined` | Default amount value |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onPaymentSuccess` | `(response) => void` | Called when payment succeeds |
| `onPaymentFailure` | `(error) => void` | Called when payment fails |
| `onOrderCreated` | `(order) => void` | Called when order is created |
| `onFormSubmit` | `(data) => void` | Called when form is submitted |
| `validateForm` | `(data) => string \| null` | Custom form validation |

## Styling Examples

### Using CSS Classes

```tsx
<RazorpayPaymentForm
  backendUrl="https://your-api.com/api"
  razorpayKeyId="rzp_test_your_key_id"
  className="my-payment-form"
  formClassName="payment-form"
  inputClassName="form-input"
  buttonClassName="submit-btn"
  labelClassName="form-label"
/>
```

```css
.my-payment-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
}

.form-input:focus {
  border-color: #3b82f6;
  outline: none;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Using Inline Styles

```tsx
<RazorpayPaymentForm
  backendUrl="https://your-api.com/api"
  razorpayKeyId="rzp_test_your_key_id"
  style={{
    backgroundColor: '#f8fafc',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  }}
  inputStyle={{
    padding: '14px 18px',
    border: '2px solid #cbd5e0',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: 'white'
  }}
  buttonStyle={{
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    padding: '16px 32px',
    borderRadius: '25px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }}
/>
```

## Backend Requirements

Your backend should implement these endpoints:

### POST /order
Create a new payment order
```json
{
  "amount": 100000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": "Payment for order #123"
}
```

### POST /payments/verify
Verify payment signature
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

### GET /orders/:orderId
Get order details
```
GET /orders/order_xxx
```

## Advanced Usage

### Custom Validation

```tsx
<RazorpayPaymentForm
  backendUrl="https://your-api.com/api"
  razorpayKeyId="rzp_test_your_key_id"
  validateForm={(data) => {
    if (data.amount < 100) {
      return 'Minimum amount is ₹100';
    }
    if (!data.receipt.startsWith('RCP_')) {
      return 'Receipt must start with RCP_';
    }
    return null;
  }}
/>
```

### Using the Service Directly

```tsx
import { createRazorpayService } from '@your-org/razorpay-payment-form';

const razorpayService = createRazorpayService('https://your-api.com/api');

// Create order
const order = await razorpayService.createPaymentByRazorpay({
  amount: 100000,
  currency: 'INR',
  receipt: 'receipt_123',
  notes: 'Test payment'
});

// Verify payment
const verification = await razorpayService.verifyPayment({
  razorpay_order_id: 'order_xxx',
  razorpay_payment_id: 'pay_xxx',
  razorpay_signature: 'signature_xxx'
});
```

## TypeScript Support

The package includes full TypeScript definitions:

```tsx
import { 
  RazorpayPaymentForm, 
  PaymentFormData, 
  PaymentResponse,
  RazorpayPaymentFormProps 
} from '@your-org/razorpay-payment-form';
```

## License

MIT © [Your Name]