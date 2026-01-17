import Header from '@/components/layout/Header'
import TypeScale from '@/components/typography/TypeScale'
import { Button } from '@unifirst/ui'
import { InputField } from '@unifirst/ui'

export default function TypographyPage() {
  return (
    <div className="page-container">
      <Header
        title="Typography"
        description="Font families, type scale, and text styles for consistent brand communication."
      />

      {/* Font Family */}
      <section className="mb-12">
        <h2 className="section-title">Font Family</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="text-lg font-semibold text-unifirst-gray-dark mb-4">
              Primary Font
            </h3>
            <p
              className="text-4xl font-medium text-unifirst-gray-dark mb-4"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              DM Sans
            </p>
            <p className="text-sm text-unifirst-gray-slate mb-4">
              DM Sans is our primary typeface for all digital applications. It
              offers excellent readability at all sizes and a modern,
              professional appearance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-unifirst-gray-lightest rounded text-sm font-normal">
                Regular 400
              </span>
              <span className="px-3 py-1 bg-unifirst-gray-lightest rounded text-sm font-medium">
                Medium 500
              </span>
              <span className="px-3 py-1 bg-unifirst-gray-lightest rounded text-sm font-semibold">
                Semibold 600
              </span>
              <span className="px-3 py-1 bg-unifirst-gray-lightest rounded text-sm font-bold">
                Bold 700
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="text-lg font-semibold text-unifirst-gray-dark mb-4">
              Monospace Font
            </h3>
            <p
              className="text-4xl font-medium text-unifirst-gray-dark mb-4 font-mono"
            >
              Space Mono
            </p>
            <p className="text-sm text-unifirst-gray-slate mb-4">
              Space Mono is used for code samples, data tables, and technical
              content where monospaced text is needed.
            </p>
            <div className="bg-unifirst-gray-lightest rounded p-3">
              <code className="text-sm text-unifirst-gray-dark font-mono">
                font-family: 'Space Mono', monospace;
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Type Scale */}
      <section className="mb-12">
        <h2 className="section-title">Type Scale</h2>
        <p className="text-unifirst-gray-slate mb-6">
          A consistent type scale ensures visual hierarchy and readability
          across all interfaces.
        </p>
        <TypeScale />
      </section>

      {/* Text Styles */}
      <section className="mb-12">
        <h2 className="section-title">Text Styles in Context</h2>
        <div className="bg-white rounded-lg border border-unifirst-gray-light p-8">
          <article className="max-w-2xl">
            <h1 className="text-3xl font-bold text-unifirst-gray-dark mb-4">
              Article Title Example
            </h1>
            <p className="text-unifirst-gray-slate text-sm mb-6">
              Published January 2026 • 5 min read
            </p>
            <p className="text-base text-unifirst-gray-dark mb-4 leading-relaxed">
              This is an example of body text in a typical article layout. The
              primary body text uses a 16px size with 1.5 line height for
              optimal readability. Paragraphs should have sufficient spacing to
              create clear visual separation.
            </p>
            <h2 className="text-xl font-semibold text-unifirst-gray-dark mt-8 mb-3">
              Section Heading
            </h2>
            <p className="text-base text-unifirst-gray-dark mb-4 leading-relaxed">
              Secondary sections use smaller headings to maintain hierarchy.
              Notice how the font weight and size work together to create visual
              distinction without overwhelming the content.
            </p>
            <blockquote className="border-l-4 border-unifirst-green pl-4 my-6 italic text-unifirst-gray-slate">
              "Blockquotes use italic styling with the brand green accent to
              stand out from body text."
            </blockquote>
            <h3 className="text-lg font-medium text-unifirst-gray-dark mt-6 mb-2">
              Subsection Title
            </h3>
            <p className="text-sm text-unifirst-gray-dark mb-4 leading-relaxed">
              Smaller subsections use 14px text for secondary content. This size
              is also used for UI labels, form fields, and supporting
              information throughout the application.
            </p>
            <p className="text-xs text-unifirst-gray-slate">
              Caption text at 12px is used for timestamps, metadata, and helper
              text that supplements the main content.
            </p>
          </article>
        </div>
      </section>

      {/* UI Text Examples */}
      <section>
        <h2 className="section-title">UI Text Examples</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="text-sm font-semibold text-unifirst-gray-dark mb-4 uppercase tracking-wider">
              Button Labels
            </h3>
            <div className="space-y-3">
              <Button className="w-full">Primary Action</Button>
              <Button variant="outline" className="w-full">
                Secondary Action
              </Button>
              <Button variant="ghost" className="w-full">
                Text Button
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="text-sm font-semibold text-unifirst-gray-dark mb-4 uppercase tracking-wider">
              Form Labels
            </h3>
            <div className="space-y-4">
              <InputField
                id="email-address"
                label="Email Address"
                placeholder="you@example.com"
                helperText="We'll never share your email."
              />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
            <h3 className="text-sm font-semibold text-unifirst-gray-dark mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="block px-3 py-2 text-sm font-medium text-unifirst-green bg-unifirst-green-lightest rounded-md"
              >
                Active Item
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-sm font-medium text-unifirst-gray-dark hover:bg-unifirst-gray-lightest rounded-md"
              >
                Default Item
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-sm text-unifirst-gray-slate hover:text-unifirst-gray-dark rounded-md"
              >
                Secondary Item
              </a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
