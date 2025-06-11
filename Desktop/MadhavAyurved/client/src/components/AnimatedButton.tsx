import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '',
  type = 'button'
}: AnimatedButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        relative overflow-hidden px-8 py-3 rounded-full font-semibold
        bg-gradient-to-r from-primary-500 to-primary-600
        text-white shadow-md
        transition-all duration-300
        hover:shadow-lg hover:from-primary-600 hover:to-primary-700
        active:scale-95
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '100%', opacity: 0 }}
        whileHover={{ x: '-100%', opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}; 