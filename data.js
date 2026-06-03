// seed.js — Run: node seed.js
// Seeds 100+ products across all categories with real image URLs

const mongoose = require('mongoose');
const Product  = require('./models/Product');

// ─── Change this to your MongoDB URI ───
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quickmart';

const products = [

  // ═══════════════════════════════════════════
  //  1. DAIRY & DAIRY PRODUCTS  (10 items)
  // ═══════════════════════════════════════════
  {
    title: 'Amul Taaza Toned Milk 1L',
    price: 32,
    category: 'Dairy & Dairy product',
    description: 'Fresh pasteurised toned milk with 3% fat. Rich in calcium and protein, ideal for daily use.',
    images: [
      'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=600',
  },
  {
    title: 'Sudha Full Cream Milk 500ml',
    price: 28,
    category: 'Dairy & Dairy product',
    description: '100% pure full cream milk from Bihar State Milk Co-op (COMFED). No preservatives.',
    images: [
      'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
  },
  // {
  //   title: 'Amul Butter 500g',
  //   price: 260,
  //   category: 'Dairy & Dairy product',
  //   description: 'Classic Amul salted butter made from fresh cream. Perfect on bread, roti or for cooking.',
  //   images: [
  //     'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&w=600',
  //     'https://images.pexels.com/photos/4873557/pexels-photo-4873557.jpeg?auto=compress&w=600',
  //   ],
  //   image: 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&w=600',
  // },
  {
    title: 'Amul Paneer 200g',
    price: 85,
    category: 'Dairy & Dairy product',
    description: 'Fresh, soft Amul paneer made from pure cow milk. Ready to cook straight from the pack.',
    images: [
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
  },
  {
    title: 'Mother Dairy Dahi 400g',
    price: 45,
    category: 'Dairy & Dairy product',
    description: 'Thick set curd made from double toned milk. Probiotic-rich, great with meals or lassi.',
    images: [
      'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Masti Spiced Buttermilk 200ml',
    price: 15,
    category: 'Dairy & Dairy product',
    description: 'Chilled buttermilk with jeera and mint flavour. Refreshing summer drink.',
    images: [
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
  },
  {
    title: 'Nestlé MUNCH Cheese Slice 200g',
    price: 99,
    category: 'Dairy & Dairy product',
    description: 'Individually wrapped processed cheese slices. Perfect for sandwiches and burgers.',
    images: [
      'https://images.pexels.com/photos/4873557/pexels-photo-4873557.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4873557/pexels-photo-4873557.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Ghee 500ml',
    price: 285,
    category: 'Dairy & Dairy product',
    description: 'Pure cow ghee with rich aroma. Made from fresh cream using traditional method.',
    images: [
      'https://images.pexels.com/photos/4397921/pexels-photo-4397921.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4397921/pexels-photo-4397921.jpeg?auto=compress&w=600',
  },
  {
    title: 'Aashirvaad Svasti Toned Milk 1L',
    price: 34,
    category: 'Dairy & Dairy product',
    description: '100% pure and trusted toned milk from ITC Aashirvaad. Hygienically packed.',
    images: [
      'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Kool Milk Shake Chocolate 200ml',
    price: 30,
    category: 'Dairy & Dairy product',
    description: 'Ready-to-drink chocolate flavoured milk shake. Great for kids and adults alike.',
    images: [
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3735217/pexels-photo-3735217.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  2. INSTANT FOOD  (10 items)
  // ═══════════════════════════════════════════
  {
    title: 'Maggi 2-Minute Noodles Masala 70g',
    price: 14,
    category: 'Instant Food',
    description: 'India\'s favourite instant noodles with iconic masala taste. Ready in just 2 minutes.',
    images: [
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
  },
  {
    title: 'Sunfeast Yippee Magic Masala Noodles 70g',
    price: 14,
    category: 'Instant Food',
    description: 'Long & slurpy noodles with non-sticky texture. Extra tasty magic masala flavour.',
    images: [
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
  },
  {
    title: 'Top Ramen Chicken Instant Noodles 70g',
    price: 12,
    category: 'Instant Food',
    description: 'Smooth noodles in rich chicken flavoured broth. A quick and satisfying meal.',
    images: [
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
  },
  {
    title: 'MTR Poha Instant Breakfast 60g',
    price: 25,
    category: 'Instant Food',
    description: 'Ready in 5 minutes. Authentic poha with mustard seeds, curry leaves and peanuts.',
    images: [
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
  },
  {
    title: 'Knorr Classic Tomato Soup 40g',
    price: 32,
    category: 'Instant Food',
    description: 'Instant tomato soup mix — just add hot water. Rich, creamy and full of flavour.',
    images: [
      'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&w=600',
  },
  {
    title: 'Aashirvaad Instant Upma Mix 200g',
    price: 45,
    category: 'Instant Food',
    description: 'Traditional South Indian upma ready in minutes. Made with semolina and spices.',
    images: [
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
  },
  {
    title: 'Maggi Atta Noodles Masala 80g',
    price: 16,
    category: 'Instant Food',
    description: 'Whole wheat Maggi noodles — same great taste with added nutrition of atta.',
    images: [
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
  },
  {
    title: 'Haldiram\'s Dal Makhani Ready to Eat 300g',
    price: 110,
    category: 'Instant Food',
    description: 'Restaurant-style dal makhani ready in 3 minutes. No preservatives, pure taste.',
    images: [
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
  },
  {
    title: 'MTR 3 Minute Palak Paneer 300g',
    price: 120,
    category: 'Instant Food',
    description: 'Fresh spinach gravy with soft paneer cubes. Microwavable and ready in 3 minutes.',
    images: [
      'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&w=600',
  },
  {
    title: 'Patanjali Atta Noodles 60g',
    price: 10,
    category: 'Instant Food',
    description: 'Healthy whole wheat noodles from Patanjali with natural spice mix. No maida.',
    images: [
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  3. DRINK & JUICE  (10 items)
  // ═══════════════════════════════════════════
  {
    title: 'Coca-Cola 750ml Bottle',
    price: 45,
    category: 'Drink & Juice',
    description: 'The iconic Coca-Cola sparkling beverage. Best served chilled with ice.',
    images: [
      'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
  },
  {
    title: 'Maaza Mango Drink 600ml',
    price: 40,
    category: 'Drink & Juice',
    description: 'Real mango pulp drink by Coca-Cola. Thick, sweet and irresistibly fruity.',
    images: [
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
  },
  {
    title: 'Tropicana Orange Juice 1L',
    price: 110,
    category: 'Drink & Juice',
    description: '100% pure orange juice with no added sugar. Rich in Vitamin C. Chilled fresh.',
    images: [
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
  },
  {
    title: 'Sprite 600ml Bottle',
    price: 40,
    category: 'Drink & Juice',
    description: 'Clear lemon-lime flavoured sparkling drink. Crisp and refreshing — the thirst-buster.',
    images: [
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
  },
  {
    title: 'Real Fruit Power Apple 1L',
    price: 95,
    category: 'Drink & Juice',
    description: 'Dabur Real fruit juice made from ripe apples. No artificial colours or flavours.',
    images: [
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
  },
  {
    title: 'Limca Nimbu Pani 600ml',
    price: 40,
    category: 'Drink & Juice',
    description: 'Lemony sparkling drink with the fresh zing of nimboo. Beat the heat instantly.',
    images: [
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
  },
  {
    title: 'Appy Fizz Apple Sparkling Drink 250ml',
    price: 25,
    category: 'Drink & Juice',
    description: 'Sparkling apple drink by Parle Agro. Fizzy, fruity and uniquely refreshing.',
    images: [
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
  },
  {
    title: 'Mountain Dew 600ml',
    price: 40,
    category: 'Drink & Juice',
    description: 'Bold citrus-flavoured soft drink with high energy. Dar ke aage jeet hai!',
    images: [
      'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
  },
  {
    title: 'B Natural Guava Juice 1L',
    price: 99,
    category: 'Drink & Juice',
    description: 'ITC B Natural made from real guava — no added preservatives. Farm to glass.',
    images: [
      'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&w=600',
  },
  {
    title: 'Red Bull Energy Drink 250ml',
    price: 125,
    category: 'Drink & Juice',
    description: 'Vitalises body and mind. Contains caffeine, B-group vitamins and taurine.',
    images: [
      'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  4. ICE CREAM  (8 items)
  // ═══════════════════════════════════════════
  {
    title: 'Amul Vanilla Ice Cream 500ml',
    price: 110,
    category: 'Ice Cream',
    description: 'Classic creamy vanilla ice cream made from Amul milk. Smooth and indulgent.',
    images: [
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
  },
  {
    title: 'Kwality Walls Cornetto Choco Fudge',
    price: 30,
    category: 'Ice Cream',
    description: 'Waffle cone filled with rich chocolate ice cream and a gooey chocolate core.',
    images: [
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
  },
  {
    title: 'Havmor Sitafal Ice Cream 750ml',
    price: 170,
    category: 'Ice Cream',
    description: 'Seasonal custard apple ice cream with real fruit chunks. Limited edition.',
    images: [
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Chocobar 60ml',
    price: 20,
    category: 'Ice Cream',
    description: 'Milk ice cream coated with chocolate. The all-time favourite Indian ice cream bar.',
    images: [
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
  },
  {
    title: 'Mother Dairy Mango Dolly',
    price: 25,
    category: 'Ice Cream',
    description: 'Mango flavoured frozen dessert on a stick. Summer special — pure mango joy.',
    images: [
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
  },
  {
    title: 'Baskin Robbins Tutti Frutti 100ml Cup',
    price: 60,
    category: 'Ice Cream',
    description: 'Premium tutti frutti ice cream with colourful fruit bits. A party in every bite.',
    images: [
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
  },
  {
    title: 'Kwality Walls Feast Choco Brownie',
    price: 35,
    category: 'Ice Cream',
    description: 'Thick chocolate ice cream bar with brownie pieces and chocolate coating.',
    images: [
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Sundae Magic Butterscotch 125ml',
    price: 50,
    category: 'Ice Cream',
    description: 'Butterscotch ice cream topped with praline sauce. Dessert in a cup.',
    images: [
      'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1343520/pexels-photo-1343520.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  5. CHIPS & NAMKEEN  (10 items)
  // ═══════════════════════════════════════════
  {
    title: 'Kurkure Masala Munch 90g',
    price: 20,
    category: 'Chips & Namkeen',
    description: 'India\'s favourite crunchy snack with tangy masala flavour. Tedha hai par mera hai!',
    images: [
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
  },
  {
    title: 'Lay\'s Classic Salted 73g',
    price: 20,
    category: 'Chips & Namkeen',
    description: 'Crispy potato chips with the perfect light salt seasoning. No artificial flavours.',
    images: [
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
  },
  {
    title: 'Haldiram\'s Aloo Bhujia 200g',
    price: 65,
    category: 'Chips & Namkeen',
    description: 'Spicy potato sev — the iconic Haldiram snack. Perfect with chai or as topping.',
    images: [
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
  },
  {
    title: 'Too Yumm Multigrain Chips Cream Onion 55g',
    price: 20,
    category: 'Chips & Namkeen',
    description: 'Baked not fried multigrain chips. 35% less fat, 100% more crunch.',
    images: [
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
  },
  {
    title: 'Bikaji Moong Dal 200g',
    price: 55,
    category: 'Chips & Namkeen',
    description: 'Crispy fried moong dal lightly spiced with jeera and black pepper.',
    images: [
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
  },
  {
    title: 'Pringles Original 107g',
    price: 149,
    category: 'Chips & Namkeen',
    description: 'Once you pop you can\'t stop! Uniform stackable crisps in iconic tennis ball can.',
    images: [
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
  },
  {
    title: 'Bingo Mad Angles Achaari Masti 75g',
    price: 20,
    category: 'Chips & Namkeen',
    description: 'Triangular crisps with tangy achaari flavour. Unique shape, addictive taste.',
    images: [
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
  },
  {
    title: 'Haldiram\'s Mixture 200g',
    price: 70,
    category: 'Chips & Namkeen',
    description: 'Classic North Indian mixture with sev, peanuts, dried peas and spices.',
    images: [
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
  },
  {
    title: 'Parle Monaco Classic Salted Biscuit 200g',
    price: 30,
    category: 'Chips & Namkeen',
    description: 'Crispy salted crackers with distinctive hole pattern. Great with chai or cheese.',
    images: [
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
  },
  {
    title: 'Doritos Nacho Cheese 123g',
    price: 149,
    category: 'Chips & Namkeen',
    description: 'Thick triangular corn chips loaded with bold nacho cheese seasoning.',
    images: [
      'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  6. SWEETS & CHOCOLATE  (8 items)
  // ═══════════════════════════════════════════
  {
    title: 'Cadbury Dairy Milk Silk 145g',
    price: 145,
    category: 'Sweets & Chocolate',
    description: 'Silkiest, creamiest Dairy Milk ever. Smooth pour-able chocolate inside.',
    images: [
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
  },
  {
    title: 'KitKat Chunky 40g',
    price: 40,
    category: 'Sweets & Chocolate',
    description: 'Thick chunky KitKat bar with crispy wafer inside rich milk chocolate.',
    images: [
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
  },
  {
    title: 'Haldiram\'s Rasgulla 500g Tin',
    price: 130,
    category: 'Sweets & Chocolate',
    description: 'Spongy cottage cheese balls soaked in light sugar syrup. Traditional Bengali sweet.',
    images: [
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
  },
  {
    title: 'Ferrero Rocher 16pc Box',
    price: 415,
    category: 'Sweets & Chocolate',
    description: 'Premium hazelnut chocolates in golden foil. The perfect gifting choice.',
    images: [
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
  },
  {
    title: 'Milky Bar White Chocolate 40g',
    price: 45,
    category: 'Sweets & Chocolate',
    description: 'Smooth and creamy white chocolate with real milk. Loved by kids.',
    images: [
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
  },
  {
    title: 'Patanjali Cow Ghee Ladoo 500g',
    price: 250,
    category: 'Sweets & Chocolate',
    description: 'Traditional besan ladoos made with pure cow ghee and cardamom. Festive sweet.',
    images: [
      'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&w=600',
  },
  {
    title: '5 Star Crunchy 40g',
    price: 20,
    category: 'Sweets & Chocolate',
    description: 'Caramel and nougat centre coated in smooth milk chocolate. Melt-worthy bliss.',
    images: [
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
  },
  {
    title: 'Amul Chocolate Bar 150g',
    price: 75,
    category: 'Sweets & Chocolate',
    description: 'Classic Amul milk chocolate — rich, smooth and affordable. Made in India.',
    images: [
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  7. BATH & BODY  (8 items)
  // ═══════════════════════════════════════════
  {
    title: 'Pears Transparent Soap 75g',
    price: 45,
    category: 'Bath & Body',
    description: 'Gentle transparent bar soap with glycerin. Dermatologist tested, 98% pure.',
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
  },
  {
    title: 'Dove Body Lotion 250ml',
    price: 195,
    category: 'Bath & Body',
    description: 'Nourishing body lotion with 1/4 moisturising cream. Skin stays soft 24 hours.',
    images: [
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
  },
  {
    title: 'Head & Shoulders Anti Dandruff Shampoo 340ml',
    price: 270,
    category: 'Bath & Body',
    description: 'Clinically proven to remove dandruff in 1 wash. Clean & balanced formula.',
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
  },
  {
    title: 'Lux Soft Touch Rose Bar Soap 100g',
    price: 35,
    category: 'Bath & Body',
    description: 'French rose extract and jojoba beads for soft, glowing skin after every wash.',
    images: [
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
  },
  {
    title: 'Himalaya Neem Face Wash 150ml',
    price: 95,
    category: 'Bath & Body',
    description: 'Purifying neem face wash that removes oil and prevents pimples. Herbal formula.',
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
  },
  {
    title: 'Colgate MaxFresh Blue Toothpaste 150g',
    price: 89,
    category: 'Bath & Body',
    description: 'Cooling crystals release freshness. Fights cavities and gives 12-hour protection.',
    images: [
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
  },
  {
    title: 'Fogg Fresh Deodorant Body Spray 150ml',
    price: 199,
    category: 'Bath & Body',
    description: 'No gas, only perfume! Long-lasting Fogg body spray with 800+ sprays per bottle.',
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
  },
  {
    title: 'Pantene Pro-V Smooth & Silky Conditioner 175ml',
    price: 175,
    category: 'Bath & Body',
    description: 'Deep conditioning formula for frizz-free, silky smooth hair.',
    images: [
      'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  8. HOUSEHOLD  (8 items)
  // ═══════════════════════════════════════════
  {
    title: 'Surf Excel Easy Wash Detergent 1kg',
    price: 115,
    category: 'Household',
    description: 'Removes tough stains in just 1 wash. Safe for all fabrics and hand wash.',
    images: [
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
  },
  {
    title: 'Fortune Soyabean Refined Oil 1L',
    price: 130,
    category: 'Household',
    description: 'Light and healthy refined soyabean oil. Rich in Omega-3 and Vitamin E.',
    images: [
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
  },
  {
    title: 'Harpic Power Plus Toilet Cleaner 1L',
    price: 110,
    category: 'Household',
    description: '10X stronger formula removes tough stains and kills 99.9% germs.',
    images: [
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
  },
  {
    title: 'Dalda Vanaspati Ghee 1kg',
    price: 185,
    category: 'Household',
    description: 'Hydrogenated vegetable fat for baking, frying and Indian cooking. Classic Dalda.',
    images: [
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
  },
  {
    title: 'Vim Bar Dishwash 300g',
    price: 42,
    category: 'Household',
    description: 'Vim lemon dishwash bar cuts through grease instantly. Sparkling clean in less time.',
    images: [
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
  },
  {
    title: 'Tata Salt 1kg',
    price: 24,
    category: 'Household',
    description: 'Iodised vacuum evaporated salt. Fine grain, free flowing and fortified with iodine.',
    images: [
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
  },
  {
    title: 'Lizol Floor Cleaner Citrus 975ml',
    price: 175,
    category: 'Household',
    description: 'Kills 99.9% germs on floors. Fresh citrus fragrance leaves floors gleaming.',
    images: [
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
  },
  {
    title: 'Scotch-Brite Scrub Pad 3pcs',
    price: 55,
    category: 'Household',
    description: 'Heavy-duty non-scratch scouring pad for vessels and pans. Lasts 3x longer.',
    images: [
      'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  9. ELECTRONICS  (8 items)
  // ═══════════════════════════════════════════
  {
    title: 'boAt Bassheads 100 Wired Earphones',
    price: 399,
    category: 'Electronic',
    description: '10mm dynamic driver with HD sound and extra bass. In-line mic, 1.2m flat cable.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
  },
  {
    title: 'Syska 10W Fast Charger USB Type-C',
    price: 299,
    category: 'Electronic',
    description: 'Smart chip for fast, safe charging. Compatible with Android and iPhone 15+.',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
  },
  {
    title: 'Ambrane 10000mAh Power Bank',
    price: 799,
    category: 'Electronic',
    description: '10000mAh slim power bank with dual output and LED indicator. Charges 2 devices.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
  },
  {
    title: 'TP-Link TL-WR841N WiFi Router',
    price: 1199,
    category: 'Electronic',
    description: '300Mbps wireless N router. Wide coverage for home and small offices.',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
  },
  {
    title: 'Mi USB Data Cable Type-C 1m',
    price: 199,
    category: 'Electronic',
    description: 'Braided nylon cable with aluminium connector. Supports fast data transfer & charging.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
  },
  {
    title: 'Portronics Pebble Bluetooth Speaker',
    price: 999,
    category: 'Electronic',
    description: 'Compact wireless speaker with 5W output and 6-hour battery life. IPX5 splash proof.',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
  },
  {
    title: 'Panasonic LED Bulb 9W B22',
    price: 89,
    category: 'Electronic',
    description: 'Energy-efficient 9W LED bulb with 900 lumen output. 25,000-hour lifespan.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
  },
  {
    title: 'Havells Extension Board 4 Socket 2m',
    price: 449,
    category: 'Electronic',
    description: 'ISI marked 4-socket extension with master switch and surge protection.',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  10. SIM & RECHARGE  (6 items)
  // ═══════════════════════════════════════════
  {
    title: 'Airtel New SIM Card',
    price: 49,
    category: 'SIM & Recharge',
    description: 'New Airtel prepaid SIM with 28-day validity plan. Get 2GB/day + unlimited calls.',
    images: [
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
  },
  {
    title: 'Jio SIM New Connection',
    price: 49,
    category: 'SIM & Recharge',
    description: 'Jio 4G prepaid SIM. Welcome offer with 1.5GB/day data for 28 days.',
    images: [
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
  },
  {
    title: 'BSNL Prepaid SIM Card',
    price: 49,
    category: 'SIM & Recharge',
    description: 'BSNL SIM with free voice calls and 1GB data. Best network in rural Bihar.',
    images: [
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
  },
  {
    title: 'Airtel ₹179 Recharge Plan',
    price: 179,
    category: 'SIM & Recharge',
    description: '28-day validity. 2GB/day 4G data + unlimited calls + 100 SMS/day.',
    images: [
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
  },
  {
    title: 'Jio ₹155 Recharge Plan',
    price: 155,
    category: 'SIM & Recharge',
    description: '24-day validity with 1GB/day data + unlimited Jio-to-Jio calls.',
    images: [
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
  },
  {
    title: 'Vi ₹199 Recharge Plan',
    price: 199,
    category: 'SIM & Recharge',
    description: '28-day plan with 1.5GB/day + unlimited calls + free weekend data rollover.',
    images: [
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  11. STATIONERY  (6 items)
  // ═══════════════════════════════════════════
  {
    title: 'Classmate Pulse Long Notebook A4 172 Pages',
    price: 55,
    category: 'Stationery',
    description: 'Single-rule notebook with thick pages. Ideal for school and college students.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },
  {
    title: 'Cello Butterflow Ball Pen Blue (Pack of 10)',
    price: 45,
    category: 'Stationery',
    description: 'Smooth writing ball pen with comfortable grip. Non-stop writing, 1.5km ink.',
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
  },
  {
    title: 'Faber-Castell Eraser Dust-free White',
    price: 20,
    category: 'Stationery',
    description: 'Soft eraser that removes cleanly without paper damage. PVC-free and safe.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },
  {
    title: 'Camlin Permanent Marker Black',
    price: 30,
    category: 'Stationery',
    description: 'Waterproof, fade-resistant permanent marker. Writes on glass, plastic and fabric.',
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
  },
  {
    title: 'Apsara Platinum Extra Dark Pencil Set of 10',
    price: 40,
    category: 'Stationery',
    description: 'HB grade extra dark pencils. Smooth, clean writing ideal for exams.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },
  {
    title: 'Stapler with 1000 Pins Set',
    price: 85,
    category: 'Stationery',
    description: 'Office stapler with metal body and 1000 staple pins. Handles up to 20 sheets.',
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  12. MOBILE PHONE  (6 items)
  // ═══════════════════════════════════════════
  {
    title: 'Samsung Galaxy M14 5G 4GB+128GB',
    price: 12990,
    category: 'Mobile phone',
    description: '5G smartphone with 50MP camera, 6000mAh battery and Exynos 1330 chipset.',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
  },
  {
    title: 'Redmi 13C 4GB+128GB',
    price: 9499,
    category: 'Mobile phone',
    description: 'MediaTek Helio G85, 50MP AI camera, 5000mAh battery. Built for performance.',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
  },
  {
    title: 'Nokia 105 Single SIM Feature Phone',
    price: 1199,
    category: 'Mobile phone',
    description: 'Long battery life feature phone with FM radio. Best for rural connectivity.',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
  },
  {
    title: 'Poco M6 Pro 5G 6GB+128GB',
    price: 14999,
    category: 'Mobile phone',
    description: '5G phone with Dimensity 6080, 50MP camera, 5000mAh + 33W fast charge.',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
  },
  {
    title: 'itel P40 4GB+64GB',
    price: 7499,
    category: 'Mobile phone',
    description: '6.6" HD+ display, 6000mAh battery, 13MP camera. Affordable and reliable.',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
  },
  {
    title: 'Samsung Galaxy F15 5G 6GB+128GB',
    price: 13999,
    category: 'Mobile phone',
    description: '6000mAh battery with 25W fast charging. AMOLED display and 50MP main camera.',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  13. PRINT & NOTEBOOK  (5 items)
  // ═══════════════════════════════════════════
  {
    title: 'A4 Printout Black & White (per page)',
    price: 2,
    category: 'Print Notebook',
    description: 'High quality laser printout on 70gsm A4 paper. Single-sided, black & white.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },
  {
    title: 'A4 Colour Printout (per page)',
    price: 10,
    category: 'Print Notebook',
    description: 'Vibrant full-colour laser print on A4 paper. Ideal for photos and documents.',
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
  },
  {
    title: 'Classmate Interleaf Spiral Notebook A4',
    price: 75,
    category: 'Print Notebook',
    description: '200 pages spiral notebook with interleaf design. Perforated pages for easy removal.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },
  {
    title: 'Photo Print 4x6 Glossy (per print)',
    price: 15,
    category: 'Print Notebook',
    description: 'Professional glossy photo print on premium photo paper. Vivid colours.',
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
  },
  {
    title: 'Aadhaar/Document Lamination (per page)',
    price: 10,
    category: 'Print Notebook',
    description: 'Hot lamination for Aadhaar, certificates or any document. Scratch-proof, waterproof.',
    images: [
      'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&w=600',
  },

  // ═══════════════════════════════════════════
  //  14. CASH WITHDRAW ADHAR  (3 items)
  // ═══════════════════════════════════════════
  {
    title: 'Aadhaar Cash Withdraw ₹100–₹500',
    price: 10,
    category: 'Cash Withdraw Adhar',
    description: 'Micro ATM cash withdrawal using Aadhaar biometric. Instant cash, ₹10 service fee.',
    images: [
      'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=600',
  },
  {
    title: 'Aadhaar Cash Withdraw ₹501–₹2000',
    price: 20,
    category: 'Cash Withdraw Adhar',
    description: 'Withdraw up to ₹2000 using Aadhaar fingerprint at our store. Fast & secure.',
    images: [
      'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&w=600',
  },
  {
    title: 'Aadhaar Cash Withdraw ₹2001–₹5000',
    price: 40,
    category: 'Cash Withdraw Adhar',
    description: 'Withdraw ₹2001 to ₹5000 via Aadhaar Pay. Real-time debit from any bank account.',
    images: [
      'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=600',
      'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&w=600',
    ],
    image: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=600',
  },
];

// ─────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`🗑  Cleared ${deleted.deletedCount} existing products`);

    // Insert all products
    const inserted = await Product.insertMany(products);
    console.log(`✨ Seeded ${inserted.length} products successfully!\n`);

    // Summary by category
    const summary = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log('📦 Products per category:');
    Object.entries(summary).forEach(([cat, count]) =>
      console.log(`   ${cat.padEnd(28)} → ${count} products`)
    );

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected. Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
