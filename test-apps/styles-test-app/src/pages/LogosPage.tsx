import Header from '@/components/layout/Header'
import { Button } from '@unifirst/ui'
import { Check, X, Image, FileText, Download, Folder } from 'lucide-react'
import { cn } from '@unifirst/ui'

interface LogoVariant {
  id: string
  name: string
  description: string
  background: string
  logoColor: string
}

const logoVariants: LogoVariant[] = [
  {
    id: 'primary',
    name: 'Primary Logo',
    description: 'Use on white or light backgrounds',
    background: 'bg-white',
    logoColor: 'text-unifirst-green',
  },
  {
    id: 'reversed',
    name: 'Reversed Logo',
    description: 'Use on dark or brand green backgrounds',
    background: 'bg-unifirst-green',
    logoColor: 'text-white',
  },
  {
    id: 'mono-dark',
    name: 'Monochrome Dark',
    description: 'Single-color applications on light backgrounds',
    background: 'bg-white',
    logoColor: 'text-unifirst-gray-dark',
  },
  {
    id: 'mono-light',
    name: 'Monochrome Light',
    description: 'Single-color applications on dark backgrounds',
    background: 'bg-unifirst-gray-dark',
    logoColor: 'text-white',
  },
]

function LogoPlaceholder({ color }: { color: string }) {
  return (
    <div className={cn('flex items-center gap-3', color)}>
      <div className="w-12 h-12 border-2 border-current rounded-lg flex items-center justify-center">
        <span className="font-bold text-xl">U</span>
      </div>
      <div>
        <span className="font-bold text-lg tracking-tight">UniFirst</span>
        <span className="text-xs block opacity-70">Style Guide</span>
      </div>
    </div>
  )
}

export default function LogosPage() {
  return (
    <div className="page-container">
      <Header
        title="Logo & Brand Assets"
        description="Approved logo variations, usage guidelines, and downloadable brand assets."
      />

      {/* Logo Variations */}
      <section className="mb-12">
        <h2 className="section-title">Logo Variations</h2>
        <p className="text-unifirst-gray-slate mb-6">
          Use the appropriate logo version based on the background and context.
          Always maintain proper contrast.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {logoVariants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden"
            >
              <div
                className={cn(
                  variant.background,
                  'h-40 flex items-center justify-center border-b border-unifirst-gray-light'
                )}
              >
                <LogoPlaceholder color={variant.logoColor} />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-unifirst-gray-dark">
                    {variant.name}
                  </h3>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
                <p className="text-sm text-unifirst-gray-slate">
                  {variant.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clear Space */}
      <section className="mb-12">
        <h2 className="section-title">Clear Space & Minimum Size</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-unifirst-gray-dark mb-4">
              Clear Space
            </h3>
            <div className="bg-unifirst-gray-lightest rounded-lg p-8 mb-4">
              <div className="relative inline-block">
                {/* Clear space visualization */}
                <div className="absolute -inset-4 border-2 border-dashed border-unifirst-green-light rounded opacity-50" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-unifirst-green font-medium">
                  X
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-unifirst-green font-medium">
                  X
                </div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-xs text-unifirst-green font-medium">
                  X
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-xs text-unifirst-green font-medium">
                  X
                </div>
                <LogoPlaceholder color="text-unifirst-green" />
              </div>
            </div>
            <p className="text-sm text-unifirst-gray-slate">
              Maintain clear space equal to the height of the "U" mark (X) on
              all sides of the logo. This ensures the logo remains prominent and
              uncluttered.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-unifirst-gray-dark mb-4">
              Minimum Size
            </h3>
            <div className="bg-unifirst-gray-lightest rounded-lg p-8 mb-4 flex items-center gap-8">
              <div className="text-center">
                <div className="mb-2 scale-50 origin-center">
                  <LogoPlaceholder color="text-unifirst-green" />
                </div>
                <p className="text-xs text-unifirst-gray-slate">Digital: 80px</p>
              </div>
              <div className="text-center">
                <div className="mb-2 scale-75 origin-center">
                  <LogoPlaceholder color="text-unifirst-green" />
                </div>
                <p className="text-xs text-unifirst-gray-slate">Print: 1 inch</p>
              </div>
            </div>
            <p className="text-sm text-unifirst-gray-slate">
              Never reproduce the logo smaller than the minimum sizes shown.
              This ensures legibility and maintains brand integrity across all
              applications.
            </p>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="mb-12">
        <h2 className="section-title">Logo Usage Guidelines</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-unifirst-green mb-4 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Correct Usage
            </h3>
            <ul className="space-y-3 text-sm text-unifirst-gray-dark">
              <li className="flex items-start gap-2">
                <span className="text-unifirst-green">✓</span>
                Use approved logo files only
              </li>
              <li className="flex items-start gap-2">
                <span className="text-unifirst-green">✓</span>
                Maintain clear space requirements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-unifirst-green">✓</span>
                Use appropriate color variant for background
              </li>
              <li className="flex items-start gap-2">
                <span className="text-unifirst-green">✓</span>
                Keep logo proportions intact
              </li>
              <li className="flex items-start gap-2">
                <span className="text-unifirst-green">✓</span>
                Ensure sufficient contrast with background
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
              <X className="w-5 h-5" />
              Incorrect Usage
            </h3>
            <ul className="space-y-3 text-sm text-unifirst-gray-dark">
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                Do not stretch or distort the logo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                Do not change logo colors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                Do not add effects (shadows, gradients, outlines)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                Do not rotate or flip the logo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                Do not place on busy or low-contrast backgrounds
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section>
        <h2 className="section-title">Download Assets</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg border border-unifirst-gray-light hover:border-unifirst-green transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-unifirst-gray-lightest rounded-lg flex items-center justify-center mx-auto mb-3">
                <Image className="w-6 h-6 text-unifirst-gray-slate" />
              </div>
              <p className="font-medium text-unifirst-gray-dark text-sm mb-1">
                PNG Package
              </p>
              <p className="text-xs text-unifirst-gray-slate">
                All variations, multiple sizes
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border border-unifirst-gray-light hover:border-unifirst-green transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-unifirst-gray-lightest rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-unifirst-gray-slate" />
              </div>
              <p className="font-medium text-unifirst-gray-dark text-sm mb-1">
                SVG Package
              </p>
              <p className="text-xs text-unifirst-gray-slate">
                Scalable vector format
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border border-unifirst-gray-light hover:border-unifirst-green transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-unifirst-gray-lightest rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-unifirst-gray-slate" />
              </div>
              <p className="font-medium text-unifirst-gray-dark text-sm mb-1">
                EPS Package
              </p>
              <p className="text-xs text-unifirst-gray-slate">
                Print-ready files
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border border-unifirst-gray-light hover:border-unifirst-green transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-unifirst-gray-lightest rounded-lg flex items-center justify-center mx-auto mb-3">
                <Folder className="w-6 h-6 text-unifirst-gray-slate" />
              </div>
              <p className="font-medium text-unifirst-gray-dark text-sm mb-1">
                Full Brand Kit
              </p>
              <p className="text-xs text-unifirst-gray-slate">
                All formats and guidelines
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
