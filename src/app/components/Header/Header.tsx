"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation'

const Header: React.FC = () => {
  const pathname = usePathname()

  if (pathname === '/') {
    return null;
  }

  return (
    <header>
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
    
  </header>
  );
};

export default Header;
