import { useState } from 'react'
import { Badge } from '@unifirst/ui'

interface ContrastResult {
  ratio: number
  aa: boolean
  aaa: boolean
  aaLarge: boolean
  aaaLarge: boolean
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function checkContrast(hex1: string, hex2: string): ContrastResult {
  const ratio = getContrastRatio(hex1, hex2)
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  }
}

const presetColors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'UniFirst Green', hex: '#00B194' },
  { name: 'Cool Gray 10', hex: '#63666A' },
  { name: 'Slate Gray', hex: '#97999B' },
  { name: 'Light Gray', hex: '#D9D9D6' },
]

export default function ContrastChecker() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#FFFFFF')

  const result = checkContrast(foreground, background)

  return (
    <div className="bg-white rounded-lg border border-unifirst-gray-light p-6">
      <h3 className="text-lg font-semibold text-unifirst-gray-dark mb-4">
        Contrast Checker
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-unifirst-gray-dark mb-2">
            Foreground Color
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-unifirst-gray-light"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 px-3 py-2 border border-unifirst-gray-light rounded-md font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {presetColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setForeground(color.hex)}
                className="w-6 h-6 rounded border border-unifirst-gray-light hover:scale-110 transition-transform"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-unifirst-gray-dark mb-2">
            Background Color
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-unifirst-gray-light"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 px-3 py-2 border border-unifirst-gray-light rounded-md font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {presetColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setBackground(color.hex)}
                className="w-6 h-6 rounded border border-unifirst-gray-light hover:scale-110 transition-transform"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-lg p-6 mb-6 text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        <p className="text-2xl font-bold mb-2">Sample Text</p>
        <p className="text-base">The quick brown fox jumps over the lazy dog.</p>
        <p className="text-sm mt-2">
          Small text example for accessibility testing.
        </p>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-unifirst-gray-lightest rounded-lg">
          <p className="text-3xl font-bold text-unifirst-gray-dark font-mono">
            {result.ratio}:1
          </p>
          <p className="text-sm text-unifirst-gray-slate">Contrast Ratio</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-unifirst-gray-lightest rounded-lg text-center">
            <Badge variant={result.aa ? 'success' : 'error'}>
              {result.aa ? 'Pass' : 'Fail'}
            </Badge>
            <p className="text-xs text-unifirst-gray-slate mt-1">AA Normal</p>
          </div>
          <div className="p-3 bg-unifirst-gray-lightest rounded-lg text-center">
            <Badge variant={result.aaa ? 'success' : 'error'}>
              {result.aaa ? 'Pass' : 'Fail'}
            </Badge>
            <p className="text-xs text-unifirst-gray-slate mt-1">AAA Normal</p>
          </div>
          <div className="p-3 bg-unifirst-gray-lightest rounded-lg text-center">
            <Badge variant={result.aaLarge ? 'success' : 'error'}>
              {result.aaLarge ? 'Pass' : 'Fail'}
            </Badge>
            <p className="text-xs text-unifirst-gray-slate mt-1">AA Large</p>
          </div>
          <div className="p-3 bg-unifirst-gray-lightest rounded-lg text-center">
            <Badge variant={result.aaaLarge ? 'success' : 'error'}>
              {result.aaaLarge ? 'Pass' : 'Fail'}
            </Badge>
            <p className="text-xs text-unifirst-gray-slate mt-1">AAA Large</p>
          </div>
        </div>
      </div>
    </div>
  )
}
