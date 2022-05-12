import React from 'react';
import { Link } from 'react-router-dom';

function CustomLink({to,children}) {
  return (
    <Link to={to} className="dark:text-dark-subtle transition hover:text-primary text-light-subtle dark:hover:text-white">
        {children}
    </Link>
  );
}

export default CustomLink;
