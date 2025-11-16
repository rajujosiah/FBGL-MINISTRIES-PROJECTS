import React from 'react';
import './ConnectionError.css';

const ConnectionError = ({ message, onRetry }) => {
  return (
    <div className="connection-error">
      <div className="error-icon">⚠️</div>
      <h3>Connection Error</h3>
      <p>{message || 'Failed to connect to the server. Please check your internet connection.'}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionError;

