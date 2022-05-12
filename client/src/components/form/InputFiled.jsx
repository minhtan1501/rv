import React from 'react'

function InputFiled({name,placeholder,label,...rest}) {
  return (
    <div className="flex flex-col-reverse ">
    <input
      id={name}
      name={name}
      className="
      bg-transparent 
      rounded border-2
    dark:border-dark-subtle 
     dark:focus:border-white p-1
      w-full text-lg outline-none
      dark:text-white peer transition
      focus:border-primary"
      placeholder={placeholder}
    {...rest}
 />
    <label
      htmlFor={name}
      className="dark:peer-focus:text-white peer-focus:text-primary transition font-semibold text-light-subtle dark:text-dark-subtle self-start "
    >
      {label}
    </label>
  </div>
  )
}

export default InputFiled