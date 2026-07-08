import { describe, it, expect } from 'vitest';
import { formatPricePaise } from './formatPrice';

describe('formatPricePaise', () => {
  it('formats whole rupees with Indian digit grouping (thousands)', () => {
    expect(formatPricePaise(118000)).toBe('₹1,180');
  });

  it('formats large amounts with lakh-style grouping', () => {
    expect(formatPricePaise(12345600)).toBe('₹1,23,456');
  });

  it('shows two decimal places when there are paise left over', () => {
    expect(formatPricePaise(118050)).toBe('₹1,180.50');
  });

  it('formats zero', () => {
    expect(formatPricePaise(0)).toBe('₹0');
  });

  it('formats a crore-range amount from the mock data (₹2,844.00 order)', () => {
    expect(formatPricePaise(284400)).toBe('₹2,844');
  });
});
