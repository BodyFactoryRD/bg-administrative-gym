"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NavLink({ href, children, className = '', onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`px-4 py-1 rounded-lg transition-colors ${
        isActive 
          ? 'bg-amber-400 text-black' 
          : 'hover:bg-gray-800'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
