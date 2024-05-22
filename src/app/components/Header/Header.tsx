"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Routes } from '@/app/constants/routes';
const Header: React.FC = () => {
  const pathname = usePathname()

  if (![Routes.BitfinexCandleChart, Routes.BitfinexOrderBook].some(route => route === pathname)) {
    return null;
  }
 
  return (
    <header>
      <Link href="/">Home</Link>
    </header>
  );
};

export default Header;


