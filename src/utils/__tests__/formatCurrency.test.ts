import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats integer to Indonesian Rupiah', () => {
    const result = formatCurrency(25000)
    expect(result).toContain('25.000')
    expect(result).toContain('Rp')
  })

  it('handles zero value', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toContain('Rp')
  })

  it('handles large numbers', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1.000.000')
  })

  it('rounds decimal to nearest integer', () => {
    expect(formatCurrency(25000.49)).toContain('25.000')
    expect(formatCurrency(25000.51)).toContain('25.001')
  })

  it('handles negative numbers', () => {
    const result = formatCurrency(-5000)
    expect(result).toContain('5.000')
    expect(result).toContain('-')
  })

  it('handles very small numbers', () => {
    expect(formatCurrency(1)).toContain('1')
  })

  it('handles very large numbers', () => {
    expect(formatCurrency(999999999)).toContain('999.999.999')
  })
})
