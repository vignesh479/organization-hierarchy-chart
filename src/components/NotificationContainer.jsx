import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import './NotificationContainer.css';

const NotificationIcon = ({ type }) => {
  const icons = {
    success: '✓',
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️'
  };
  return <div className={`notification-icon ${type}`}>{icons[type]}</div>;
};

const Notification = ({ notification, onClose }) => {
  const { id, messages, type, action } = notification;

  const handleAction = () => {
    if (action && action.handler) {
      action.handler();
      onClose(id);
    }
  };

  return (
    <div className={`notification notification-${type}`}>
      <NotificationIcon type={type} />
      <div className="notification-content">
        {messages.length === 1 ? (
          <div className="notification-message">{messages[0]}</div>
        ) : (
          <ul className="notification-message-list">
            {messages.map((msg, index) => (
              <li key={index} className="notification-message-item">{msg}</li>
            ))}
          </ul>
        )}
        {action && (
          <button 
            className="notification-action-btn" 
            onClick={handleAction}
          >
            {action.label || 'Action'}
          </button>
        )}
      </div>
      <button 
        className="notification-close-btn" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification 
          key={notification.id} 
          notification={notification} 
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}

