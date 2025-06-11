import { useState, useEffect } from 'react';

export function useDialog(initialState = false, autoDismissTime = 5000) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'error' | 'success' | 'warning'>('error');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && autoDismissTime > 0) {
      timer = setTimeout(() => {
        closeDialog();
      }, autoDismissTime);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoDismissTime]);

  const openDialog = (newMessage: string, newTitle?: string, newType?: 'error' | 'success' | 'warning') => {
    setMessage(newMessage);
    setTitle(newTitle || 'Error');
    setType(newType || 'error');
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setMessage('');
  };

  return {
    isOpen,
    message,
    title,
    type,
    openDialog,
    closeDialog
  };
} 