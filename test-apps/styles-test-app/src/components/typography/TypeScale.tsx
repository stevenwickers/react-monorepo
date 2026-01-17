interface TypeScaleItem {
  name: string
  className: string
  size: string
  lineHeight: string
  weight: string
  usage: string
}

const typeScale: TypeScaleItem[] = [
  {
    name: 'Display',
    className: 'text-5xl font-bold',
    size: '48px',
    lineHeight: '1.1',
    weight: '700',
    usage: 'Hero headlines, major announcements',
  },
  {
    name: 'Heading 1',
    className: 'text-4xl font-bold',
    size: '36px',
    lineHeight: '1.2',
    weight: '700',
    usage: 'Page titles, section headers',
  },
  {
    name: 'Heading 2',
    className: 'text-3xl font-semibold',
    size: '30px',
    lineHeight: '1.25',
    weight: '600',
    usage: 'Major section headings',
  },
  {
    name: 'Heading 3',
    className: 'text-2xl font-semibold',
    size: '24px',
    lineHeight: '1.3',
    weight: '600',
    usage: 'Sub-section headings',
  },
  {
    name: 'Heading 4',
    className: 'text-xl font-semibold',
    size: '20px',
    lineHeight: '1.4',
    weight: '600',
    usage: 'Card titles, widget headers',
  },
  {
    name: 'Heading 5',
    className: 'text-lg font-medium',
    size: '18px',
    lineHeight: '1.4',
    weight: '500',
    usage: 'Small section titles',
  },
  {
    name: 'Body Large',
    className: 'text-base',
    size: '16px',
    lineHeight: '1.5',
    weight: '400',
    usage: 'Primary body text, paragraphs',
  },
  {
    name: 'Body',
    className: 'text-sm',
    size: '14px',
    lineHeight: '1.5',
    weight: '400',
    usage: 'Secondary body text, UI labels',
  },
  {
    name: 'Caption',
    className: 'text-xs',
    size: '12px',
    lineHeight: '1.5',
    weight: '400',
    usage: 'Helper text, timestamps, metadata',
  },
]

export default function TypeScale() {
  return (
    <div className="space-y-6">
      {typeScale.map((item) => (
        <div
          key={item.name}
          className="bg-white rounded-lg border border-unifirst-gray-light p-6"
        >
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <p className={`${item.className} text-unifirst-gray-dark mb-2`}>
                {item.name}
              </p>
              <p className="text-sm text-unifirst-gray-slate">{item.usage}</p>
            </div>
            <div className="flex-shrink-0 text-right text-sm space-y-1">
              <p>
                <span className="text-unifirst-gray-slate">Size:</span>{' '}
                <span className="font-mono text-unifirst-gray-dark">
                  {item.size}
                </span>
              </p>
              <p>
                <span className="text-unifirst-gray-slate">Line height:</span>{' '}
                <span className="font-mono text-unifirst-gray-dark">
                  {item.lineHeight}
                </span>
              </p>
              <p>
                <span className="text-unifirst-gray-slate">Weight:</span>{' '}
                <span className="font-mono text-unifirst-gray-dark">
                  {item.weight}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
