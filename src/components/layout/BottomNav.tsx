'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, ChefHat, Heart, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/planificador', label: 'Plan', icon: CalendarDays },
  { href: '/recetas', label: 'Recetas', icon: ChefHat },
  { href: '/preferencias', label: 'Gustos', icon: Heart },
  { href: '/compras', label: 'Compras', icon: ShoppingCart },
] as const

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around bg-surface-container-lowest shadow-[0_-1px_0_0_var(--outline-variant)] pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center gap-0.5 px-2 py-1"
            aria-label={label}
          >
            <Icon
              strokeWidth={2}
              size={22}
              className={cn(
                'transition-colors',
                isActive ? 'text-primary' : 'text-on-surface-variant'
              )}
            />
            <span
              className={cn(
                'text-label-xs transition-colors',
                isActive ? 'text-primary' : 'text-on-surface-variant'
              )}
            >
              {label}
            </span>
            {isActive && (
              <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
