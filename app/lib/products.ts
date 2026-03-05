export type Product = {
  id: number;
  slug: string;
  name: string;
  price_cents: number;
  category: string;
  sizes: string[];
  image_urls: string[];
};

export const COLORWAYS = ['black', 'pink'] as const;
export type Colorway = typeof COLORWAYS[number];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
