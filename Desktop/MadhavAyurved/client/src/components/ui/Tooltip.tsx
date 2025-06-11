"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Tooltip = ({
  children,
  content,
  position = "top"
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: "bottom-full -left-20 translate-x-1/2 mb-2",
    bottom: "top-full -left-0 translate-x-1/2 mt-2",
    left: "right-full top-0 translate-y-1/2 mr-2",
    right: "left-full top-0 translate-y-1/2 ml-2"
  };

  const arrowClasses = {
    top: "-bottom-1 left-3/4 -translate-x-1/2",
    bottom: "-top-1 left-1/2 -translate-x-1/2",
    left: "-right-1 top-1/2 -translate-y-1/2",
    right: "-left-1 top-1/2 -translate-y-1/2"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute pointer-events-none ${positionClasses[position]}`}
          >
            <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
              {content}
              <div className={`absolute w-2 h-2 bg-gray-800 rotate-45 ${arrowClasses[position]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 