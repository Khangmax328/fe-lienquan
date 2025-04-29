import React from 'react';
import './LoadingSpinner.css'; // nhớ tạo file css này

function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;
