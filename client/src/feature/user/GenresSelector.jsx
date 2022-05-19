import React from 'react'
import {ImTree} from 'react-icons/im'
export default function GenresSelector({onClick,badge}) {
  const renderBadge = () => {
    return (
      <span
        className="dark:bg-dark-subtle 
    bg-light-subtle absolute top-0 right-0 w-5 h-5 
    rounded-full flex justify-center items-center
    translate-x-2 -translate-y-1 text-xs
    "
      >
        {badge <= 9 ? badge : '9+'}
      </span>
    );
  };
  return (
   <button
   type="button"
   onClick={onClick} 
   className="
   flex items-center space-x-2 py-1 px-3 relative
   border-2 dark:border-dark-subtle
   dark:hover:border-white hover:border-primary 
   transition dark:text-dark-subtle text-light-subtle
   dark:text-white hover:text-primary rounded">
       <ImTree/>
       <span>Select Genres</span>
       {badge ?  renderBadge() : null}
   </button>
  )
}
