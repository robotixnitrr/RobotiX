import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning';
}

export default function Dialog({ isOpen, onClose, title, message, type = 'error' }: DialogProps) {
  if (!isOpen) return null;

  const bgColors = {
    error: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50'
  };

  const textColors = {
    error: 'text-red-700',
    success: 'text-green-700',
    warning: 'text-yellow-700'
  };

  const borderColors = {
    error: 'border-red-400',
    success: 'border-green-400',
    warning: 'border-yellow-400'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div 
        className={`
          ${bgColors[type]} 
          ${borderColors[type]}
          border-l-4
          rounded-lg 
          shadow-lg 
          overflow-hidden
          transition-all 
          duration-300 
          ease-in-out
          transform
        `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${textColors[type]}`}>
                {title}
              </h3>
              <p className={`mt-1 text-sm ${textColors[type]} opacity-90`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`ml-4 ${textColors[type]} hover:opacity-70 focus:outline-none`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 