import React from 'react';
import { RazorpayPaymentForm } from '@your-org/razorpay-payment-form';
import '@your-org/razorpay-payment-form/styles';

function App() {
  return (
    <div className="app">
      <h1>Razorpay Payment Form Example</h1>
      
      <div className="examples">
        <div className="example">
          <h2>Default Styling</h2>
          <RazorpayPaymentForm
            backendUrl="https://your-api.com/api"
            razorpayKeyId="rzp_test_your_key_id"
            onPaymentSuccess={(response) => {
              console.log('Payment successful:', response);
              alert('Payment successful!');
            }}
            onPaymentFailure={(error) => {
              console.error('Payment failed:', error);
              alert('Payment failed!');
            }}
            onOrderCreated={(order) => {
              console.log('Order created:', order);
            }}
          />
        </div>

        <div className="example">
          <h2>Custom Styling</h2>
          <RazorpayPaymentForm
            backendUrl="https://your-api.com/api"
            razorpayKeyId="rzp_test_your_key_id"
            className="custom-payment-form"
            inputClassName="custom-input"
            buttonClassName="custom-button"
            labelClassName="custom-label"
            amountLabel="Payment Amount (₹)"
            currencyLabel="Payment Currency"
            receiptLabel="Receipt Number"
            notesLabel="Additional Notes"
            submitButtonText="Complete Payment"
            loadingText="Processing Payment..."
            defaultCurrency="INR"
            defaultAmount={1000}
            validateForm={(data) => {
              if (data.amount < 100) {
                return 'Minimum amount is ₹100';
              }
              return null;
            }}
            onPaymentSuccess={(response) => {
              console.log('Custom form payment successful:', response);
              alert('Custom form payment successful!');
            }}
            onPaymentFailure={(error) => {
              console.error('Custom form payment failed:', error);
              alert('Custom form payment failed!');
            }}
          />
        </div>

        <div className="example">
          <h2>Inline Styled</h2>
          <RazorpayPaymentForm
            backendUrl="https://your-api.com/api"
            razorpayKeyId="rzp_test_your_key_id"
            style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}
            inputStyle={{
              padding: '14px 18px',
              border: '2px solid #cbd5e0',
              borderRadius: '10px',
              fontSize: '16px',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
            buttonStyle={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              padding: '16px 32px',
              borderRadius: '25px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
            labelStyle={{
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '8px'
            }}
            onPaymentSuccess={(response) => {
              console.log('Styled form payment successful:', response);
              alert('Styled form payment successful!');
            }}
            onPaymentFailure={(error) => {
              console.error('Styled form payment failed:', error);
              alert('Styled form payment failed!');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;