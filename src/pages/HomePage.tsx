import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useProjectConfig } from '../hooks/useProjectConfig';
import RazorpayPaymentForm from './RazorpayPaymentForm';
import { serviceBaseUrl } from '../constants/appConstants';

const HomePage: React.FC = () => {
  const { projectName, projectDescription, theme } = useProjectConfig();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: theme.colors.primary[600] }}
            >
              Welcome to {projectName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8"
              style={{ color: theme.colors.secondary[600] }}
            >
              {projectDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Normal buttons */}
              <motion.button
                className="px-8 py-4 text-black font-bold rounded-2xl shadow-lg transition-all duration-300"
                style={{ background: theme.gradients.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>

              <motion.button
                className="px-8 py-4 font-bold rounded-2xl border-2 transition-all duration-300"
                style={{
                  borderColor: theme.colors.secondary[500],
                  color: theme.colors.secondary[600],
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>

              {/* Payment trigger button */}
              {!showPaymentForm && (
                <motion.button
                  className="px-8 py-4 text-black font-bold rounded-2xl shadow-lg transition-all duration-300"
                  style={{ background: theme.gradients.secondary }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPaymentForm(true)}
                >
                  Make Payment
                </motion.button>
              )}
            </motion.div>

            {/* Show payment form after clicking */}
            {showPaymentForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <RazorpayPaymentForm
                  backendUrl={serviceBaseUrl}
                  razorpayKeyId={import.meta.env.VITE_RAZORPAY_KEY_ID as string}
                  onPaymentSuccess={(response) => {
                    console.log('Payment successful:', response);
                  }}
                  onPaymentFailure={(error) => {
                    console.error('Payment failed:', error);
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
