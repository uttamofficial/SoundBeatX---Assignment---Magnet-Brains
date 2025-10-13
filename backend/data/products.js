// Audio gadgets product data with Indian Rupees pricing
const products = [
  {
    id: 1,
    name: 'Boat Airdopes 131 Pro',
    description: 'True wireless earbuds with 13mm drivers, 20hrs playback, IPX4 water resistance',
    price: 1299.00,
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Boat Rockerz 255 Pro',
    description: 'Neckband with 10mm drivers, 30hrs battery, ASAP Charge, IPX7 water resistance',
    price: 999.00,
    category: 'Neckbands',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Boat Stone 1000',
    description: 'Portable Bluetooth speaker with 14W output, 7hrs playback, IPX7 waterproof',
    price: 1999.00,
    category: 'Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Boat Immortal 1000D',
    description: 'Gaming headset with 50mm drivers, 7.1 surround sound, RGB lighting',
    price: 2999.00,
    category: 'Gaming Headsets',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Boat Wave Call 2',
    description: 'Smartwatch with 1.69" display, health monitoring, 7 days battery life',
    price: 2499.00,
    category: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Boat Airdopes 121v2',
    description: 'True wireless earbuds with 8mm drivers, 3hrs playback, touch controls',
    price: 999.00,
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Boat Rockerz 450',
    description: 'On-ear wireless headphone with 40mm drivers, 15hrs battery, foldable design',
    price: 1499.00,
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Boat Stone 200',
    description: 'Compact Bluetooth speaker with 5W output, 7hrs playback, voice assistant',
    price: 1299.00,
    category: 'Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Boat Bassheads 100',
    description: 'Wired earphones with 10mm drivers, tangle-free cable, in-line controls',
    price: 399.00,
    category: 'Earphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    name: 'Boat Airdopes 141',
    description: 'True wireless earbuds with 8mm drivers, 6hrs playback, ENC technology',
    price: 1199.00,
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    name: 'Boat Rockerz 330',
    description: 'Neckband with 6.2mm drivers, 12hrs battery, magnetic earbuds',
    price: 799.00,
    category: 'Neckbands',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    name: 'Boat Immortal 500D',
    description: 'Gaming headset with 50mm drivers, 7.1 surround sound, noise cancellation',
    price: 1999.00,
    category: 'Gaming Headsets',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    name: 'Boat Wave Call',
    description: 'Smartwatch with 1.3" display, fitness tracking, 10 days battery life',
    price: 1999.00,
    category: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    name: 'Boat Stone 1200',
    description: 'Portable Bluetooth speaker with 14W output, 10hrs playback, party mode',
    price: 2499.00,
    category: 'Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    name: 'Boat Rockerz 600',
    description: 'Over-ear wireless headphone with 50mm drivers, 20hrs battery, ANC',
    price: 2999.00,
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 16,
    name: 'Boat Airdopes 161',
    description: 'True wireless earbuds with 13mm drivers, 8hrs playback, fast charging',
    price: 1499.00,
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 17,
    name: 'Boat Bassheads 152',
    description: 'Wired earphones with 10mm drivers, tangle-free cable, HD sound',
    price: 499.00,
    category: 'Earphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 18,
    name: 'Boat Rockerz 400',
    description: 'On-ear wireless headphone with 40mm drivers, 8hrs battery, foldable',
    price: 1299.00,
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 19,
    name: 'Boat Stone 350',
    description: 'Portable Bluetooth speaker with 5W output, 6hrs playback, bass boost',
    price: 999.00,
    category: 'Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 20,
    name: 'Boat Airdopes 121',
    description: 'True wireless earbuds with 8mm drivers, 3hrs playback, instant connect',
    price: 799.00,
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800',
    created_at: new Date().toISOString()
  }
];

module.exports = products;