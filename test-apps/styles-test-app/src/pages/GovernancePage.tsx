import Header from '@/components/layout/Header'
import { Badge, Button, Switch } from '@unifirst/ui'
import { Card, CardHeader, CardTitle, CardContent } from '@unifirst/ui'
import { Lock, Unlock, Check, Pencil, AlertCircle, CheckCircle } from 'lucide-react'

interface ColorOverride {
  name: string
  value: string
  locked: boolean
  region?: string
}

const colorOverrides: ColorOverride[] = [
  { name: 'Primary Green', value: '#00B194', locked: true },
  { name: 'Secondary Gray', value: '#63666A', locked: true },
  { name: 'Accent Color', value: '#00B194', locked: false, region: 'EMEA' },
  { name: 'Background', value: '#F5F5F4', locked: false },
]

interface VersionEntry {
  version: string
  date: string
  author: string
  status: 'approved' | 'pending' | 'rejected'
  changes: string[]
}

const versionHistory: VersionEntry[] = [
  {
    version: '2.1.0',
    date: 'Jan 8, 2026',
    author: 'Design Team',
    status: 'approved',
    changes: [
      'Added new button variants',
      'Updated color contrast guidelines',
      'Added governance controls',
    ],
  },
  {
    version: '2.0.1',
    date: 'Dec 20, 2025',
    author: 'Brand Team',
    status: 'approved',
    changes: [
      'Fixed typography scale',
      'Updated logo clear space requirements',
    ],
  },
  {
    version: '2.0.0',
    date: 'Nov 1, 2025',
    author: 'Design Team',
    status: 'approved',
    changes: [
      'Major redesign with updated brand colors',
      'New typography system',
      'Component library overhaul',
    ],
  },
]

interface ApprovalItem {
  id: string
  title: string
  requester: string
  date: string
  type: 'color' | 'logo' | 'component'
}

const pendingApprovals: ApprovalItem[] = [
  {
    id: '1',
    title: 'New accent color for APAC region',
    requester: 'APAC Marketing',
    date: 'Jan 7, 2026',
    type: 'color',
  },
  {
    id: '2',
    title: 'Updated logo for partner program',
    requester: 'Partnerships Team',
    date: 'Jan 6, 2026',
    type: 'logo',
  },
]

export default function GovernancePage() {
  return (
    <div className="page-container">
      <Header
        title="Customization & Governance"
        description="Manage brand overrides, approvals, and version control for style guide updates."
      />

      {/* Color Overrides */}
      <section className="mb-12">
        <h2 className="section-title">Color Customization</h2>
        <p className="text-unifirst-gray-slate mb-6">
          Core brand colors are locked to maintain consistency. Regional or
          sub-brand variations require approval.
        </p>
        <div className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden">
          <div className="grid grid-cols-4 gap-px bg-unifirst-gray-light">
            {colorOverrides.map((color) => (
              <div key={color.name} className="bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-unifirst-gray-light"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.locked ? (
                    <span
                      className="text-unifirst-gray-slate"
                      title="Locked"
                    >
                      <Lock className="w-5 h-5" />
                    </span>
                  ) : (
                    <span
                      className="text-unifirst-green"
                      title="Customizable"
                    >
                      <Unlock className="w-5 h-5" />
                    </span>
                  )}
                </div>
                <p className="font-medium text-unifirst-gray-dark text-sm">
                  {color.name}
                </p>
                <p className="font-mono text-xs text-unifirst-gray-slate">
                  {color.value}
                </p>
                {color.region && (
                  <Badge variant="primary" className="mt-2">
                    {color.region}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pending Approvals */}
      <section className="mb-12">
        <h2 className="section-title">Pending Approvals</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden">
          {pendingApprovals.length > 0 ? (
            <ul className="divide-y divide-unifirst-gray-light">
              {pendingApprovals.map((item) => (
                <li
                  key={item.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-unifirst-gray-dark">
                        {item.title}
                      </span>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <p className="text-sm text-unifirst-gray-slate">
                      Requested by {item.requester} • {item.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-unifirst-gray-slate">
              No pending approvals
            </div>
          )}
        </div>
      </section>

      {/* Version History */}
      <section className="mb-12">
        <h2 className="section-title">Version History</h2>
        <div className="space-y-4">
          {versionHistory.map((version, index) => (
            <div
              key={version.version}
              className="bg-white rounded-lg border border-unifirst-gray-light p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-unifirst-gray-dark font-mono">
                      v{version.version}
                    </span>
                    {index === 0 && <Badge variant="primary">Current</Badge>}
                    <Badge
                      variant={
                        version.status === 'approved'
                          ? 'success'
                          : version.status === 'pending'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {version.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-unifirst-gray-slate">
                    {version.date} • {version.author}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </div>
              <ul className="space-y-1">
                {version.changes.map((change, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-unifirst-gray-dark"
                  >
                    <span className="w-1.5 h-1.5 bg-unifirst-green rounded-full" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Trail */}
      <section className="mb-12">
        <h2 className="section-title">Audit Trail</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 pb-4 border-b border-unifirst-gray-light">
                <div className="w-8 h-8 bg-unifirst-green-lightest rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-unifirst-green" />
                </div>
                <div>
                  <p className="text-sm text-unifirst-gray-dark">
                    <span className="font-medium">Sarah Johnson</span> approved
                    color override for EMEA region
                  </p>
                  <p className="text-xs text-unifirst-gray-slate">
                    Jan 7, 2026 at 2:34 PM
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 pb-4 border-b border-unifirst-gray-light">
                <div className="w-8 h-8 bg-unifirst-gray-lightest rounded-full flex items-center justify-center flex-shrink-0">
                  <Pencil className="w-4 h-4 text-unifirst-gray-slate" />
                </div>
                <div>
                  <p className="text-sm text-unifirst-gray-dark">
                    <span className="font-medium">Michael Chen</span> updated
                    button component specifications
                  </p>
                  <p className="text-xs text-unifirst-gray-slate">
                    Jan 6, 2026 at 11:15 AM
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 pb-4 border-b border-unifirst-gray-light">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-unifirst-gray-dark">
                    <span className="font-medium">APAC Marketing</span> requested
                    new accent color variation
                  </p>
                  <p className="text-xs text-unifirst-gray-slate">
                    Jan 5, 2026 at 9:42 AM
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-unifirst-green-lightest rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-unifirst-green" />
                </div>
                <div>
                  <p className="text-sm text-unifirst-gray-dark">
                    <span className="font-medium">Design Team</span> released
                    version 2.1.0
                  </p>
                  <p className="text-xs text-unifirst-gray-slate">
                    Jan 8, 2026 at 4:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Settings */}
      <section>
        <h2 className="section-title">Governance Settings</h2>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-unifirst-gray-light">
                  <div>
                    <p className="font-medium text-unifirst-gray-dark text-sm">
                      Require approval for color changes
                    </p>
                    <p className="text-xs text-unifirst-gray-slate">
                      All color modifications must be approved
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-unifirst-gray-light">
                  <div>
                    <p className="font-medium text-unifirst-gray-dark text-sm">
                      Require approval for logo usage
                    </p>
                    <p className="text-xs text-unifirst-gray-slate">
                      New logo applications require approval
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-unifirst-gray-dark text-sm">
                      Auto-notify stakeholders
                    </p>
                    <p className="text-xs text-unifirst-gray-slate">
                      Send emails when changes are proposed
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-unifirst-gray-lightest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-unifirst-green rounded-full flex items-center justify-center text-white text-xs font-medium">
                      DT
                    </div>
                    <div>
                      <p className="font-medium text-unifirst-gray-dark text-sm">
                        Design Team
                      </p>
                      <p className="text-xs text-unifirst-gray-slate">
                        Full access
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary">Admin</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-unifirst-gray-lightest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-unifirst-gray-slate rounded-full flex items-center justify-center text-white text-xs font-medium">
                      MK
                    </div>
                    <div>
                      <p className="font-medium text-unifirst-gray-dark text-sm">
                        Marketing
                      </p>
                      <p className="text-xs text-unifirst-gray-slate">
                        View and request
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Editor</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-unifirst-gray-lightest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-unifirst-gray-warm rounded-full flex items-center justify-center text-white text-xs font-medium">
                      DV
                    </div>
                    <div>
                      <p className="font-medium text-unifirst-gray-dark text-sm">
                        Development
                      </p>
                      <p className="text-xs text-unifirst-gray-slate">
                        View only
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Viewer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
