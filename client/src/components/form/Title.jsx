import React from 'react';

function Title({ children }) {
  return (
    <h1 className="dark:text-white text-xl text-secondary font-semibold text-center tracking-wide">
        {children}
    </h1>
  );
}

export default Title;
