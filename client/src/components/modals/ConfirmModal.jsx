import React from 'react';
import { ImSpinner3 } from 'react-icons/im';
import ModalContainer from './ModalContainer';

export default function ConfirmModal({
  visible,
  loading,
  onConfirm,
  onCancel,
  subTitle,
  title,
}) {
  const commonClass = 'px-3 py-1 text-white rounded hover:opacity-70';
  return (
    <ModalContainer visible={visible} ignoreContainer>
      <div className="dark:bg-primary bg-white rounded p-3">
        <h1 className="text-red-400 font-semibold text-lg">{title}</h1>
        <p className="text-secondary dark:text-white text-sm">{subTitle}</p>

        <div className="flex items-center space-x-3 mt-3">
          {loading ? (
            <div className="flex items-center space-x-2 text-primary dark:text-white">
              <ImSpinner3 className="animate-spin" />
              <span>Please wait</span>
            </div>
          ) : (
            <>
              <button
                onClick={onConfirm}
                type="button"
                className={commonClass + ' bg-red-500'}
              >
                Confirm
              </button>
              <button
                onClick={onCancel}
                type="button"
                className={commonClass + ' bg-blue-500'}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
