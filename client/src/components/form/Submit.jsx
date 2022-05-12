import React from 'react';
import {ImSpinner3} from 'react-icons/im'
export default function Submit({ value,loadding }) {
  return (
    <button
      type="submit"
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
      disabled={loadding}
    >
  {loadding ? <ImSpinner3 className="animate-spin"/> : value}
    </button>
  );
}
