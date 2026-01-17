import Header from '@/components/layout/Header'
import QuickAccessCard from '@/components/dashboard/QuickAccessCard'
import RecentUpdates from '@/components/dashboard/RecentUpdates'
import { Badge } from '@unifirst/ui'
import { Palette, Type, Image, Component } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="page-container">
      <Header
        title="Style Guide Dashboard"
        description="Central hub for UniFirst brand governance and design system management."
      />

      {/* Brand Health Overview */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-unifirst-gray-dark">
              Brand Health
            </h2>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-unifirst-green font-mono">
                98%
              </p>
              <p className="text-sm text-unifirst-gray-slate">
                Color Compliance
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-unifirst-green font-mono">
                100%
              </p>
              <p className="text-sm text-unifirst-gray-slate">Logo Usage</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-unifirst-green font-mono">
                95%
              </p>
              <p className="text-sm text-unifirst-gray-slate">Typography</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-unifirst-gray-dark font-mono">
                v2.1.0
              </p>
              <p className="text-sm text-unifirst-gray-slate">Current Version</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="mb-8">
        <h2 className="section-title">Quick Access</h2>
        <div className="grid grid-cols-4 gap-6">
          <QuickAccessCard
            title="Color System"
            description="Brand palettes, tints, and contrast guidelines"
            href="/colors"
            count={12}
            icon={Palette}
          />
          <QuickAccessCard
            title="Typography"
            description="Font families, scales, and text styles"
            href="/typography"
            count={8}
            icon={Type}
          />
          <QuickAccessCard
            title="Logo & Assets"
            description="Approved logos, icons, and brand imagery"
            href="/logos"
            count={6}
            icon={Image}
          />
          <QuickAccessCard
            title="UI Components"
            description="Buttons, inputs, cards, and interactive elements"
            href="/components"
            count={24}
            icon={Component}
          />
        </div>
      </div>

      {/* Recent Updates */}
      <div className="grid grid-cols-2 gap-6">
        <RecentUpdates />

        {/* Version History */}
        <div className="bg-white rounded-lg border border-unifirst-gray-light">
          <div className="px-6 py-4 border-b border-unifirst-gray-light">
            <h3 className="text-lg font-semibold text-unifirst-gray-dark">
              Version History
            </h3>
          </div>
          <ul className="divide-y divide-unifirst-gray-light">
            <li className="px-6 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-unifirst-gray-dark font-mono">
                  v2.1.0
                </span>
                <Badge variant="primary">Current</Badge>
              </div>
              <p className="text-sm text-unifirst-gray-slate">
                Added new component variants and updated color contrast
                guidelines
              </p>
              <p className="text-xs text-unifirst-gray-slate mt-1">
                Released Jan 2026
              </p>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-unifirst-gray-dark font-mono">
                  v2.0.0
                </span>
                <Badge variant="secondary">Archived</Badge>
              </div>
              <p className="text-sm text-unifirst-gray-slate">
                Major redesign with updated brand colors and typography
              </p>
              <p className="text-xs text-unifirst-gray-slate mt-1">
                Released Nov 2025
              </p>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-unifirst-gray-dark font-mono">
                  v1.5.0
                </span>
                <Badge variant="secondary">Archived</Badge>
              </div>
              <p className="text-sm text-unifirst-gray-slate">
                Added governance controls and audit logging
              </p>
              <p className="text-xs text-unifirst-gray-slate mt-1">
                Released Sep 2025
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
