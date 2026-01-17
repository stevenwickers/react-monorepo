import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Button, Input, Label } from '@unifirst/ui'
import { Card, CardHeader, CardTitle, CardContent } from '@unifirst/ui'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@unifirst/ui'
import { Alert } from '@unifirst/ui'
import { Badge } from '@unifirst/ui'
import { InputField } from '@unifirst/ui'

export default function ComponentsPage() {
  const [selected, setSelected] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleClick = (buttonName:string) => {
    console.log(`${buttonName} button clicked!`)
    const bnt = selected === buttonName ? '' : buttonName
    setSelected(buttonName)
  }

  const handleEmailChange = (e: any) => {
    const value = e.target.value ?? ''
    setEmail(value)

    const emailError = value.length > 8 ? 'Email Error!!!' : ''
    setEmailError(emailError)
  }

  return (
    <div className="page-container">
      <Header
        title="UI Components"
        description="Reusable interface components with consistent styling and behavior across all applications."
      />

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="section-title">Buttons</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <h3 className="font-semibold text-unifirst-gray-dark mb-4">
            Variants
          </h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              aria-pressed={selected === 'primary'}
              onClick={() => handleClick('primary')}
              variant="primary"
            >
              Primary
            </Button>
            <Button
              aria-pressed={selected === 'secondary'}
              onClick={() => handleClick('secondary')}
              variant="secondary"
            >
              secondary
            </Button>
            <Button
              aria-pressed={selected === 'outline'}
              onClick={() => handleClick('outline')}
              variant="outline"
            >
              Outline
            </Button>

            <Button
              aria-pressed={selected === 'ghost'}
              onClick={() => handleClick('ghost')}
              variant="ghost"
            >
              Ghost
            </Button>

            <Button
              aria-pressed={selected === 'destructive'}
              onClick={() => handleClick('destructive')}
              variant="destructive"
            >
              destructive
            </Button>
          </div>

          <h3 className="font-semibold text-unifirst-gray-dark mb-4">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button size="sm">Small</Button>
            <Button size="default">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          <h3 className="font-semibold text-unifirst-gray-dark mb-4">States</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button className="ring-2 ring-unifirst-green ring-offset-2">
              Focused
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="section-title">Inputs</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <div className="grid grid-cols-3 gap-6">
            <InputField
              id={'default-input'}
              label="Default Input"
              placeholder="Enter text..." />

            <InputField
              id={'email-input'}
              label="With Helper Text"
              placeholder="Enter email..."
              helperText="We'll never share your email."
              maxLength={15}
              value={email}
              error={emailError}
              onChange={handleEmailChange}
            />

            <InputField
              id={'password-input'}
              label="Error State"
              placeholder="Enter password..."
              error="Password must be at least 8 characters."
            />

            <InputField
              id={'disabled-input'}
              label="Disabled Input"
              placeholder="Cannot edit..."
              disabled
            />

            <InputField
              id={'required-input'}
              label="Required Field"
              placeholder="Required..."
              required
            />

            <InputField
              id={'default-input-value'}
              label="With Value"
              value="user@example.com"
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="section-title">Cards</h2>
        <div className="grid grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-unifirst-gray-slate">
                Standard card with border styling. Use for content grouping and
                organization.
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-unifirst-gray-slate">
                Card with shadow elevation. Use sparingly for emphasis.
              </p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Bordered Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-unifirst-gray-slate">
                Card with brand color border. Use for highlighted sections.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Table */}
      <section className="mb-12">
        <h2 className="section-title">Table</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sarah Johnson</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell>Designer</TableCell>
                <TableCell className="text-unifirst-gray-slate">
                  2 hours ago
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Michael Chen</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell>Developer</TableCell>
                <TableCell className="text-unifirst-gray-slate">
                  5 minutes ago
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Emily Rodriguez</TableCell>
                <TableCell>
                  <Badge variant="warning">Away</Badge>
                </TableCell>
                <TableCell>Marketing</TableCell>
                <TableCell className="text-unifirst-gray-slate">
                  1 day ago
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">James Wilson</TableCell>
                <TableCell>
                  <Badge variant="secondary">Offline</Badge>
                </TableCell>
                <TableCell>Manager</TableCell>
                <TableCell className="text-unifirst-gray-slate">
                  3 days ago
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <h2 className="section-title">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="info" title="Information">
            This is an informational message to provide context or guidance to
            the user.
          </Alert>
          <Alert variant="success" title="Success">
            Your changes have been saved successfully. The update will take
            effect immediately.
          </Alert>
          <Alert variant="warning" title="Warning">
            Please review your settings before proceeding. Some configurations
            may affect system performance.
          </Alert>
          <Alert variant="error" title="Error">
            Unable to complete the request. Please check your connection and try
            again.
          </Alert>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="section-title">Badges</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </div>
      </section>

      {/* Component Specifications */}
      <section>
        <h2 className="section-title">Component Specifications</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Border Radius</TableHead>
                <TableHead>Padding</TableHead>
                <TableHead>Font Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Button (md)</TableCell>
                <TableCell className="font-mono text-sm">6px</TableCell>
                <TableCell className="font-mono text-sm">8px 16px</TableCell>
                <TableCell className="font-mono text-sm">14px</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Input</TableCell>
                <TableCell className="font-mono text-sm">6px</TableCell>
                <TableCell className="font-mono text-sm">8px 12px</TableCell>
                <TableCell className="font-mono text-sm">14px</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Card</TableCell>
                <TableCell className="font-mono text-sm">8px</TableCell>
                <TableCell className="font-mono text-sm">24px</TableCell>
                <TableCell className="font-mono text-sm">—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Badge</TableCell>
                <TableCell className="font-mono text-sm">9999px</TableCell>
                <TableCell className="font-mono text-sm">2px 10px</TableCell>
                <TableCell className="font-mono text-sm">12px</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Alert</TableCell>
                <TableCell className="font-mono text-sm">8px</TableCell>
                <TableCell className="font-mono text-sm">16px</TableCell>
                <TableCell className="font-mono text-sm">14px</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
