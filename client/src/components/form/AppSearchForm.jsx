import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const defaultInputStyle = `dark:border-dark-subtle 
                          border-light-subtle 
                          dark:focus:border-white
                          focus:border-primary 
                          dark:text-white text-lg`;
export default function AppSearchForm({
  placeholder,
  onSubmit,
  showResetIcon,
  onReset,
  inputClassName= defaultInputStyle
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
    setValue('');
    onReset && onReset();
  };

  return (
    <form className="relative" onSubmit={handleOnSubmit}>
      <input
        type="text"
        className={`
        border-2 transition bg-transparent 
        rounded p-1 outline-none ${inputClassName}`}
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
