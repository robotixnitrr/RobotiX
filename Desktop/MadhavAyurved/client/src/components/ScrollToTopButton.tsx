import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from "./ui/Tooltip";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 right-4 z-50"
        >
          <Tooltip
            content="Scroll to top"
            position="left"
          >
            <button
              onClick={scrollToTop}
              className="bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </button>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 