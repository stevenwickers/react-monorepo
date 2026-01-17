import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Palette,
  Type,
  Image,
  Component,
  Shield,
} from 'lucide-react'
import { cn } from '@unifirst/ui'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Color System',
    href: '/colors',
    icon: Palette,
  },
  {
    name: 'Typography',
    href: '/typography',
    icon: Type,
  },
  {
    name: 'Logo & Assets',
    href: '/logos',
    icon: Image,
  },
  {
    name: 'UI Components',
    href: '/components',
    icon: Component,
  },
  {
    name: 'Governance',
    href: '/governance',
    icon: Shield,
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-unifirst-gray-light flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-unifirst-gray-light">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-unifirst-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-semibold text-unifirst-gray-dark">UniFirst</span>
          <span className="text-xs text-unifirst-gray-slate">Style Guide</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-unifirst-green-lightest text-unifirst-green'
                      : 'text-unifirst-gray-dark hover:bg-unifirst-gray-lightest'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive ? 'text-unifirst-green' : 'text-unifirst-gray-slate'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-unifirst-gray-light">
        <div className="text-xs text-unifirst-gray-slate">
          <p>Version 2.1.0</p>
          <p className="mt-1">Last updated: Jan 2026</p>
        </div>
      </div>
    </aside>
  )
}
