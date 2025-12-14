import { Product, Category } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Grain-Free Dog Kibble',
    description: 'High-protein, grain-free formula for active adult dogs. Made with real chicken and sweet potatoes.',
    price: 49.99,
    category: Category.DOG,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 124,
    badge: 'Bestseller'
  },
  {
    id: '2',
    name: 'Interactive Laser Cat Toy',
    description: 'Automatic laser toy with 3 speed settings to keep your feline friend entertained for hours.',
    price: 24.99,
    category: Category.CAT,
    image: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 89
  },
  {
    id: '3',
    name: 'Cozy Plush Donut Bed',
    description: 'Ultra-soft calming bed for small dogs and cats. Promotes better sleep and joint relief.',
    price: 35.50,
    category: Category.ACCESSORIES,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 210,
    badge: 'Trending'
  },
  {
    id: '4',
    name: 'Durable Rubber Chew Bone',
    description: 'Indestructible rubber toy for aggressive chewers. Textured surface cleans teeth.',
    price: 15.99,
    category: Category.DOG,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 340
  },
  {
    id: '5',
    name: 'Luxury Bird Cage',
    description: 'Spacious multi-level cage for parakeets and cockatiels. Includes feeders and perches.',
    price: 120.00,
    category: Category.BIRD,
    image: 'https://images.unsplash.com/photo-1520638023360-6def43369781?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 45
  },
  {
    id: '6',
    name: 'Hamster Habitat Deluxe',
    description: 'Multi-level habitat with tunnels, wheel, and water bottle. Easy to clean.',
    price: 55.00,
    category: Category.SMALL_PET,
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 67
  },
  {
    id: '7',
    name: 'Cat Scratching Post Tower',
    description: 'Tall sisal-wrapped scratching post with a cozy perch on top.',
    price: 42.99,
    category: Category.CAT,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '8',
    name: 'Automatic Pet Feeder',
    description: 'Programmable feeder with voice recording and portion control. WiFi enabled.',
    price: 89.99,
    category: Category.ACCESSORIES,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 98,
    badge: 'Tech'
  },
  {
    id: '9',
    name: 'Organic Catnip Treat Mix',
    description: 'A blend of organic catnip and silvervine. Irresistible to 90% of cats.',
    price: 9.99,
    category: Category.CAT,
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 412
  },
  {
    id: '10',
    name: 'Reflective Dog Leash',
    description: 'Heavy-duty 5ft leash with padded handle and reflective stitching for night safety.',
    price: 18.50,
    category: Category.DOG,
    image: 'https://images.unsplash.com/photo-1605639156481-244775d6f803?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 130
  }
];