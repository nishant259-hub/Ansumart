require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.log("❌ Error: Please provide an email!");
  console.log("✅ Example usage: node make-admin.js aapka-email@gmail.com");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`🎉 Success! '${user.email}' is now an Admin!`);
      console.log(`Aap ab /admin dashboard access kar sakte hain.`);
    } else {
      console.log(`❌ User not found with email: '${email}'`);
      console.log(`💡 Tip: Pehle apni website par ja kar is email se 'Register' ya 'Login with Google' karein.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ DB Error:', err);
    process.exit(1);
  });
