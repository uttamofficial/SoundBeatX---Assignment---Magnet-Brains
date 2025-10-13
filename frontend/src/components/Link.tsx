import React from 'react';
import { NavLink } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ children, href, className = '', ...props }: LinkProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => `transition-colors ${
        isActive
          ? 'text-red-700 bg-white/80 border-b-2 border-red-600'
          : 'text-gray-700 hover:text-red-700 hover:bg-white/80'
      } ${className}`}
      {...props}
    >
      {children}
    </NavLink>
  );
}