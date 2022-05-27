import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
export default function AppSearchForm({
  placeholder,
  onSubmit,
  showResetIcon,
  onReset
}) {
  const [value, setValue] = useState('');
  const handleOnChange = ({ target }) => {
    setValue(target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };
  const handleReset = () => {
    setValue('')
    onReset && onReset();
  }

  return (
    <form className="relative" onSubmit={handleOnSubmit}>
      <input
        type="text"
        className="border-2 dark:border-dark-subtle 
            border-light-subtle 
            dark:focus:border-white
            focus:border-primary 
            dark:text-white 
            transition bg-transparent rounded text-lg p-1"
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
      />
      {showResetIcon ? (
        <button
          type="button"
          onClick={handleReset}
          className="
            absolute top-1/2
            -translate-y-1/2
            right-2 text-secondary dark:text-white"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
