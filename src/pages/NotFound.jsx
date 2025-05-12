import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const AlertTriangle = getIcon('AlertTriangle');
  const Home = getIcon('Home');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="text-amber-500 mb-6"
      >
        <AlertTriangle size={80} />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-surface-800 dark:text-surface-100">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-surface-700 dark:text-surface-200">
        Page Not Found
      </h2>
      
      <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8 max-w-lg">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:bg-primary-dark transition-colors"
        >
          <Home className="mr-2" size={20} />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}