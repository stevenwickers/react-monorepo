import { useState } from 'react'
import { cn } from '@unifirst/ui'

interface ColorSwatchProps {
  name: string
  hex: string
  rgb?: string
  cmyk?: string
  usage?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ColorSwatch({
  name,
  hex,
  rgb,
  cmyk,
  usage,
  size = 'md',
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sizeStyles = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  }

  return (
    <div className="bg-white rounded-lg border border-unifirst-gray-light overflow-hidden">
      <button
        onClick={copyToClipboard}
        className={cn(
          'w-full relative group cursor-pointer transition-transform hover:scale-[1.02]',
          sizeStyles[size]
        )}
        style={{ backgroundColor: hex }}
      >
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="bg-white text-unifirst-gray-dark text-xs font-medium px-2 py-1 rounded">
            {copied ? 'Copied!' : 'Click to copy'}
          </span>
        </span>
      </button>
      <div className="p-4">
        <h4 className="font-semibold text-unifirst-gray-dark mb-2">{name}</h4>
        <div className="space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="text-unifirst-gray-slate">HEX</span>
            <span className="font-mono text-unifirst-gray-dark">{hex}</span>
          </p>
          {rgb && (
            <p className="flex justify-between">
              <span className="text-unifirst-gray-slate">RGB</span>
              <span className="font-mono text-unifirst-gray-dark">{rgb}</span>
            </p>
          )}
          {cmyk && (
            <p className="flex justify-between">
              <span className="text-unifirst-gray-slate">CMYK</span>
              <span className="font-mono text-unifirst-gray-dark">{cmyk}</span>
            </p>
          )}
        </div>
        {usage && (
          <p className="mt-3 pt-3 border-t border-unifirst-gray-light text-xs text-unifirst-gray-slate">
            {usage}
          </p>
        )}
      </div>
    </div>
  )
}
