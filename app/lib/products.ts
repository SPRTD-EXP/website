export type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  category: 'TOPS' | 'BOTTOMS' | 'OUTERWEAR';
  sizes: string[];
};

export const products: Product[] = [
  { id: 1, slug: 'shirt',  name: 'SHIRT',  price: '$35.00', category: 'TOPS',    sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 2, slug: 'shorts', name: 'SHORTS', price: '$35.00', category: 'BOTTOMS', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 3, slug: 'hoodie', name: 'HOODIE', price: '$60.00', category: 'TOPS',    sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 4, slug: 'sweats', name: 'SWEATS', price: '$60.00', category: 'BOTTOMS', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
];
