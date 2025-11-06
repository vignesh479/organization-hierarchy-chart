import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  const addNotification = useCallback((message, type = 'info', duration = 5000, action = null) => {
    const id = Date.now() + Math.random();
    // Normalize message to always be an array for consistent handling
    const messages = Array.isArray(message) ? message : [message];
    const notification = { id, messages, type, duration, action };
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Replace all notifications with the new one (only show one at a time)
    setNotifications([notification]);

    // Auto-remove after duration
    if (duration > 0) {
      const newTimeoutId = setTimeout(() => {
        removeNotification(id);
      }, duration);
      setTimeoutId(newTimeoutId);
    }

    return id;
  }, [timeoutId]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showSuccess = useCallback((message, duration, action) => {
    return addNotification(message, 'success', duration, action);
  }, [addNotification]);

  const showError = useCallback((message, duration, action) => {
    return addNotification(message, 'error', duration, action);
  }, [addNotification]);

  const showInfo = useCallback((message, duration, action) => {
    return addNotification(message, 'info', duration, action);
  }, [addNotification]);

  const showWarning = useCallback((message, duration, action) => {
    return addNotification(message, 'warning', duration, action);
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

