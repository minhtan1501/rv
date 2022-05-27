import React from 'react';
import {ImSpinner3} from 'react-icons/im'
export default function Submit({ value,loading ,type, onClick}) {
  return (
    <button
      type={type || 'submit'}
      onClick={onClick}
      className="p-1 
      bg-secondary 
      dark:text-secondary 
      text-white  
      cursor-pointer 
      font-semibold 
      w-full rounded 
      dark:bg-white 
      hover:bg-opacity-90 
      transition text-lg
      h-10 flex items-center justify-center"
      disabled={loading}
    >
  {loading ? <ImSpinner3 className="animate-spin"/> : value}
    </button>
  );
}
