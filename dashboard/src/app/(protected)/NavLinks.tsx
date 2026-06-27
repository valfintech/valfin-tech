'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',          label: 'Overview',       icon: '◈' },
  { href: '/emails',    label: 'Email Review',   icon: '✉' },
  { href: '/companies', label: 'Companies',      icon: '⬡' },
  { href: '/research',  label: 'Research',       icon: '◎' },
  { href: '/campaign',  label: 'Campaign',       icon: '▶' },
  { href: '/replies',   label: 'Replies',        icon: '↩' },
  { href: '/meetings',  label: 'Meetings',       icon: '◷' },
  { href: '/activity',  label: 'Activity Log',   icon: '≡' },
  { href: '/health',    label: 'Health',         icon: '◉' },
  { href: '/settings',  label: 'Settings',       icon: '⚙' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {NAV.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: isActive ? '#a5b4fc' : 'var(--muted)',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
