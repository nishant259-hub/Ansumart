require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    const result = await Product.deleteMany({});
    console.log(`🗑 ${result.deletedCount} products deleted successfully!`);
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ DB Error:', err);
    process.exit(1);
  });
