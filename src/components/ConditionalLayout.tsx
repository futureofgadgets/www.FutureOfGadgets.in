'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './ui/Navbar'
import BottomNav from './BottomNav'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Admin routes don't need navbar or padding
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }
  
  // Regular routes get navbar and padding
  return (
    <>
      <Navbar />
      <div className="pt-10 md:pt-14 pb-12 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  )
}