import React from 'react';

export default function ModalContainer({
  children,
  ignoreContainer,
  visible,
  onClose,
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!onClose) return;
    if (e.target.id === 'modal-container') onClose && onClose();
  };
  const renderChildren =() => {
    if(ignoreContainer) return children
    return (
      <div className="dark:bg-primary bg-white rounded w-[45rem] 
      h-[40rem] overflow-auto p-3 custom-scroll-bar">
        {children}
      </div>
    )
  }
  if (!visible) return null;
  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white 
      dark:bg-opacity-50 bg-opacity-50 bg-primary 
      backdrop-blur-sm flex items-center justify-center"
    >
        {renderChildren()}
    </div>
  );
}
