import { useEffect } from 'react';

export default function PopupModal({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'delete':
        return '🗑️';
      case 'view':
        return '👁️';
      case 'edit':
        return '✏️';
      default:
        return 'ℹ️';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'var(--success)';
      case 'error':
        return 'var(--danger)';
      case 'warning':
      case 'delete':
        return 'var(--warning)';
      default:
        return 'var(--primary-600)';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        
        <div className="popup-header">
          <div 
            className="popup-icon" 
            style={{ backgroundColor: `${getTitleColor()}20`, color: getTitleColor() }}
          >
            {getIcon()}
          </div>
          <h3 className="popup-title" style={{ color: getTitleColor() }}>
            {title}
          </h3>
        </div>

        <div className="popup-body">
          <p className="popup-message">{message}</p>
        </div>

        <div className="popup-actions">
          {showCancel && (
            <button className="btn btn-outline" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={`btn ${type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
