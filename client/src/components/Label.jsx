import React from 'react';
export default function Label({ children, htmlFor }) {
  return (
    <label
      className="dark:text-dark-subtle text-light-subtle
            font-semibold"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
