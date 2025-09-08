// This file is used as a template and will be rendered at container startup
// Do not commit secrets. Values should be provided via container env.
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
  VITE_RAZORPAY_KEY_ID: "${VITE_RAZORPAY_KEY_ID}",
  VITE_STRIPE_PUBLISHABLE_KEY: "${VITE_STRIPE_PUBLISHABLE_KEY}",
  VITE_HTTPS: "${VITE_HTTPS}",
  VITE_DEV_HOST: "${VITE_DEV_HOST}"
};
