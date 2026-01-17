import Header from '@/components/layout/Header'
import ColorSwatch from '@/components/colors/ColorSwatch'
import ContrastChecker from '@/components/colors/ContrastChecker'
import { brandColors, neutralColors, semanticColors } from '@/lib/colors'
import { Check, X } from 'lucide-react'

export default function ColorsPage() {
  return (
    <div className="page-container">
      <Header
        title="Color System"
        description="UniFirst brand color palette with approved tints, shades, and usage guidelines."
      />

      {/* Primary Brand Colors */}
      <section className="mb-12">
        <h2 className="section-title">Primary Brand Palette</h2>
        <p className="text-unifirst-gray-slate mb-6">
          The UniFirst green is our core brand anchor. Use it for primary
          actions, highlights, and key brand moments.
        </p>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(brandColors).map(([key, color]) => (
            <ColorSwatch
              key={key}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              cmyk={color.cmyk}
              usage={color.usage}
              size="lg"
            />
          ))}
        </div>
      </section>

      {/* Neutral Colors */}
      <section className="mb-12">
        <h2 className="section-title">Neutral Palette</h2>
        <p className="text-unifirst-gray-slate mb-6">
          Grays provide hierarchy, structure, and readability. Use them for
          text, borders, backgrounds, and UI elements.
        </p>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(neutralColors).map(([key, color]) => (
            <ColorSwatch
              key={key}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              cmyk={color.cmyk}
              usage={color.usage}
            />
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="mb-12">
        <h2 className="section-title">Semantic Colors</h2>
        <p className="text-unifirst-gray-slate mb-6">
          Use semantic colors sparingly for specific purposes. Red is reserved
          for alerts and destructive actions only.
        </p>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(semanticColors).map(([key, color]) => (
            <ColorSwatch
              key={key}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              usage={color.usage}
            />
          ))}
        </div>
      </section>

      {/* Color Usage Rules */}
      <section className="mb-12">
        <h2 className="section-title">Usage Guidelines</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-unifirst-green mb-4 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Do
            </h3>
            <ul className="space-y-2 text-sm text-unifirst-gray-dark">
              <li>• Use UniFirst green (#00B194) as the primary CTA color</li>
              <li>
                • Apply grays for text hierarchy and structural elements
              </li>
              <li>
                • Ensure all color combinations meet WCAG AA standards
              </li>
              <li>• Use semantic colors only for their intended purpose</li>
              <li>
                • Maintain consistent color usage across all platforms
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
              <X className="w-5 h-5" />
              Don&apos;t
            </h3>
            <ul className="space-y-2 text-sm text-unifirst-gray-dark">
              <li>• Use red as a decorative or primary brand color</li>
              <li>• Create new color variations without approval</li>
              <li>• Use colors that fail contrast requirements</li>
              <li>• Apply gradients or effects to brand colors</li>
              <li>• Use more than 3-4 colors in a single interface</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contrast Checker */}
      <section>
        <h2 className="section-title">Contrast Checker</h2>
        <p className="text-unifirst-gray-slate mb-6">
          Test color combinations for WCAG accessibility compliance. All text
          must meet AA standards minimum.
        </p>
        <ContrastChecker />
      </section>
    </div>
  )
}
