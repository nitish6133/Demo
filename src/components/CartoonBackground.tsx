import React from 'react';
import { motion } from 'framer-motion';
import { Role } from '../types';

interface CartoonBackgroundProps {
  role?: Role | null;
  variant?: 'home' | 'profiles';
}

const CartoonBackground: React.FC<CartoonBackgroundProps> = ({ role }) => {
  const getBackgroundElements = () => {
    if (role === 'Doctor') {
      return (
        <>
          {/* Medical themed elements */}
          <motion.div
            className="absolute top-20 left-10 text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🏥
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 text-4xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🩺
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-20 text-5xl"
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💊
          </motion.div>
          <motion.div
            className="absolute top-60 left-1/3 text-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🚑
          </motion.div>
        </>
      );
    }

    if (role === 'Engineer') {
      return (
        <>
          {/* Engineering themed elements */}
          <motion.div
            className="absolute top-16 right-16 text-6xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ⚙️
          </motion.div>
          <motion.div
            className="absolute top-48 left-16 text-5xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏗️
          </motion.div>
          <motion.div
            className="absolute bottom-40 right-24 text-4xl"
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔧
          </motion.div>
          <motion.div
            className="absolute top-72 right-1/3 text-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚧
          </motion.div>
        </>
      );
    }

    if (role === 'Teacher') {
      return (
        <>
          {/* Teaching themed elements */}
          <motion.div
            className="absolute top-24 left-16 text-6xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📚
          </motion.div>
          <motion.div
            className="absolute top-52 right-20 text-5xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🎓
          </motion.div>
          <motion.div
            className="absolute bottom-36 left-24 text-4xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✏️
          </motion.div>
          <motion.div
            className="absolute top-80 left-1/2 text-3xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🏫
          </motion.div>
        </>
      );
    }

    if (role === 'Police') {
      return (
        <>
          {/* Police themed elements */}
          <motion.div
            className="absolute top-20 right-12 text-6xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚔
          </motion.div>
          <motion.div
            className="absolute top-56 left-12 text-5xl"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👮‍♀️
          </motion.div>
          <motion.div
            className="absolute bottom-44 right-16 text-4xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🚨
          </motion.div>
          <motion.div
            className="absolute top-96 left-1/3 text-3xl"
            animate={{ rotate: [0, -20, 20, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            🏛️
          </motion.div>
        </>
      );
    }

    if (role === 'Astronaut') {
      return (
        <>
          {/* Space themed elements */}
          <motion.div
            className="absolute top-16 left-12 text-6xl"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <motion.div
            className="absolute top-44 right-16 text-5xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            🌟
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-20 text-4xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🛸
          </motion.div>
          <motion.div
            className="absolute top-72 left-1/4 text-3xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌙
          </motion.div>
        </>
      );
    }

    // Default fun elements for home page
    return (
      <>
        <motion.div
          className="absolute top-20 left-10 text-6xl"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌈
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 text-5xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-16 text-4xl"
          animate={{ rotate: [0, -20, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎨
        </motion.div>
        <motion.div
          className="absolute top-60 right-1/4 text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          🎪
        </motion.div>
        <motion.div
          className="absolute bottom-60 right-12 text-4xl"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          🎭
        </motion.div>
        <motion.div
          className="absolute top-80 left-1/3 text-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎈
        </motion.div>
      </>
    );
  };

  const getBackgroundGradient = () => {
    if (role === 'Doctor') return 'bg-gradient-doctor';
    if (role === 'Engineer') return 'bg-gradient-engineer';
    if (role === 'Teacher') return 'bg-gradient-teacher';
    if (role === 'Police') return 'bg-gradient-police';
    if (role === 'Astronaut') return 'bg-gradient-astronaut';
    return 'bg-gradient-rainbow';
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundGradient()} opacity-20`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-white/40" />
      
      {/* Floating cartoon elements */}
      <div className="relative h-full w-full overflow-hidden">
        {getBackgroundElements()}
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/2 text-2xl"
          animate={{ 
            x: [0, 20, -20, 0],
            y: [0, -10, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          ✨
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/4 left-1/4 text-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          💫
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 right-1/3 text-2xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌟
        </motion.div>
      </div>
    </div>
  );
};

export default CartoonBackground;