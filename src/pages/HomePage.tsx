import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useProjectConfig } from '../hooks/useProjectConfig';
import { useToast } from '../components/UI/ToastContainer';
import PushNotificationButton from '../components/PushNotifications/PushNotificationButton';

const HomePage: React.FC = () => {
  const { projectName, projectDescription, theme } = useProjectConfig();


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

            {/* Push Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <PushNotificationButton />
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;