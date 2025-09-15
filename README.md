# Stripe Payment Form

A fully customizable React component for Stripe payments with TypeScript support.

## Features

- 🎨 **Fully Customizable** - Style every element with CSS classes or inline styles
- 🔧 **Dynamic Backend URL** - Configure backend endpoint at runtime
- 📝 **Simple Form** - Just 4 essential fields: amount, currency, receipt, notes
- 🔒 **Built-in Services** - Includes createPaymentIntent, verifyPaymentIntent
- 📱 **Responsive** - Works on all device sizes
- 🎯 **TypeScript** - Full type safety and IntelliSense support
- 🚀 **Easy Integration** - Drop-in component for any React project

## 🔐 Publishing 

To publish this package to your private npm registry, follow these steps:

1. Login
```bash
npm login --registry=http://localhost:8081/repository/frontend-packages/
```

You'll be prompted for your username, password, and email. Ensure your registry is accessible and the credentials are correct.

2. build the app

After login is successful, run:

```bash
npm run build
```

3. Publish

After build the app, run:

```bash
npm publish --registry=http://localhost:8081/repository/frontend-packages/
```

💡 Make sure your package.json includes a unique version number before publishing.

## Installation

```bash
npm install stripe-payment-form --registry=http://localhost:8081/repository/frontend-packages/
```

## Quick Start

```tsx
import React from 'react';
import { StripePaymentForm } from "stripe-payment-form";
import 'stripe-payment-form/styles';
import { serviceBaseUrl } from "./constants/appConstants";

function App() {
  return (
    <StripePaymentForm
      backendUrl={serviceBaseUrl}            // ✅ use your proxied backend 
      stripePublishableKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string}
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
| `stripePublishableKey` | `string` | Your Stripe publishable key |

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
| `defaultCurrency` | `string` | `"USD"` | Default currency value |
| `defaultAmount` | `number` | `undefined` | Default amount value |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onPaymentSuccess` | `(response) => void` | Called when payment succeeds |
| `onPaymentFailure` | `(error) => void` | Called when payment fails |
| `onPaymentIntentCreated` | `(intent) => void` | Called when payment intent is created |
| `onFormSubmit` | `(data) => void` | Called when form is submitted |
| `validateForm` | `(data) => string \| null` | Custom form validation |

## Styling Examples

### Using CSS Classes

```tsx
<StripePaymentForm
  backendUrl="https://your-api.com/api"
  stripePublishableKey="pk_test_your_publishable_key"
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
<StripePaymentForm
  backendUrl="https://your-api.com/api"
  stripePublishableKey="pk_test_your_publishable_key"
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

### POST /payment-intent/create
Create a new payment intent
```json
{
  "amount": 123,
  "currency": "USD",
  "receipt": "12312",
  "notes": {
    "userId": "12312412"
  }
}
```

### POST /payment-intent/verify
Verify payment intent
```
POST /payment-intent/verify?paymentIntentId=pi_3S7Z4BITFZzvPAwg06SMJruQ
```

## Advanced Usage

### Custom Validation

```tsx
<StripePaymentForm
  backendUrl="https://your-api.com/api"
  stripePublishableKey="pk_test_your_publishable_key"
  validateForm={(data) => {
    if (data.amount < 1) {
      return 'Minimum amount is $1';
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
import { createStripeService } from '@your-org/stripe-payment-form';

const stripeService = createStripeService('https://your-api.com/api');

// Create payment intent
const intent = await stripeService.createPaymentIntent({
  amount: 123,
  currency: 'USD',
  receipt: 'receipt_123',
  notes: {
    userId: 'user_123'
  }
});

// Verify payment intent
const verification = await stripeService.verifyPaymentIntent('pi_3S7Z4BITFZzvPAwg06SMJruQ');
```

## TypeScript Support

The package includes full TypeScript definitions:

```tsx
import { 
  StripePaymentForm, 
  PaymentFormData, 
  PaymentIntentResponse,
  StripePaymentFormProps 
} from '@your-org/stripe-payment-form';
```

## Important

Ensure that the paths for login and Stripe match, and configure both to use the proxy.