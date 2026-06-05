require('dotenv').config({ path: './.env' });
const express = require('express');
const path = require('path');
const Product = require('./models/Product');

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Order = require('./models/Order');
const Category = require('./models/Category');

// ── Multer & Cloudinary (image upload) ──
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mahi-communication_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ── Middleware ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── View Engine ──
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// ── Static Files ──
app.use(express.static(path.join(process.cwd(), 'public')));

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

app.set('trust proxy', 1);

app.use(session({
  secret: 'mahi-communicationsecret',
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),

  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true
  }
}));

// ── Google OAuth Passport Configuration ──
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

      if (!user && email) {
        // Find existing user by email to link account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        }
      }

      if (!user) {
        // Create new user if not exists
        const firstName = profile.name && profile.name.givenName ? profile.name.givenName : (profile.displayName || 'Google');
        const lastName = profile.name && profile.name.familyName ? profile.name.familyName : 'User';
        user = new User({
          googleId: profile.id,
          email: email || `${profile.id}@google.com`,
          firstName,
          lastName,
          role: 'user'
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

app.use(passport.initialize());

app.use((req, res, next) => {

  res.locals.user = req.session.user || null;

  next();

});

// ── Routes ──

// Home Page
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.render('index');
});

// Login Page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.render('login', {
    error: null,
    success: null,
    formData: {}
  });
});

app.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    // User not found
    if (!user) {

      return res.render('login', {
        error: 'User not found',
        success: null,
        formData: { email }
      });

    }

    // Password compare
    if (!user.password) {
      return res.render('login', {
        error: 'This account was created with Google. Please click "Continue with Google" to log in.',
        success: null,
        formData: { email }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.render('login', {
        error: 'Wrong password',
        success: null,
        formData: { email }
      });

    }

    // Session create
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role     // ← role save karo
    };

    req.session.save(() => {
      res.redirect('/store');
    });

  } catch (err) {

    console.log(err);

    res.send("Login error");

  }

});

app.get('/store', isLoggedIn, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('store', { products });
  } catch (error) {
    console.log(error);
    res.send("Error loading products");
  }
});

app.get('/shop', isLoggedIn, async (req, res) => {
  try {
    const products = await Product.find();

    /* fetch user address from DB */
    const user = await User.findById(req.session.user.id).select('address firstName');
    const addr = user?.address || {};

    /* Patna warehouse coordinates */
    const PATNA_LAT = 25.5941;
    const PATNA_LNG = 85.1376;

    /* Haversine distance in km */
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    let deliveryMins = 30; // default
    if (addr.latitude && addr.longitude) {
      const km = haversine(PATNA_LAT, PATNA_LNG, addr.latitude, addr.longitude);
      /* 30 min base + 2 min per km */
      deliveryMins = Math.round(30 + km * 2);
    }

    const deliveryLocation = addr.city
      ? `${addr.city}${addr.state ? ', ' + addr.state : ''}`
      : 'Your Location';

    /* Fetch extra categories from DB (admin-added) */
    const dbCategories = await Category.find().sort({ createdAt: 1 });

    res.render('shop', { products, deliveryMins, deliveryLocation, firstName: user?.firstName || '', dbCategories });

  } catch (error) {
    console.log(error);
    res.send("Error loading products");
  }
});

// Cart Page
app.get('/cart', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('firstName lastName');
    const products = await Product.find().select('_id title price images image category').limit(20);
    res.render('cart', { user, products });
  } catch (err) {
    console.error(err);
    res.render('cart', { user: req.session.user, products: [] });
  }
});


app.get('/product/:id', isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.send("Product not found");
    }

    /* Fetch user address from DB for dynamic delivery time */
    const user = await User.findById(req.session.user.id).select('address firstName');
    const addr = user?.address || {};

    /* Patna warehouse coordinates */
    const PATNA_LAT = 25.5941;
    const PATNA_LNG = 85.1376;

    /* Haversine distance in km */
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    let deliveryMins = 30; // default
    if (addr.latitude && addr.longitude) {
      const km = haversine(PATNA_LAT, PATNA_LNG, addr.latitude, addr.longitude);
      /* 30 min base + 2 min per km */
      deliveryMins = Math.round(30 + km * 2);
    }

    const deliveryLocation = addr.city
      ? `${addr.city}${addr.state ? ', ' + addr.state : ''}`
      : 'Your Location';

    // Similar products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.render('product', {
      product,
      related,
      deliveryMins,
      deliveryLocation,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


// Profile/Dashboard - full user MongoDB se fetch karo
app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    /* Populate wishlist with actual product data */
    const wishlistProducts = await Product.find({
      _id: { $in: user.wishlist || [] }
    }).select('title price image images category');

    res.render('dashboard', {
      user,
      orders,
      wishlist: wishlistProducts,
      totalOrders: orders.length || 0,
      wishlistCount: wishlistProducts.length,
      locMsg: req.query.locMsg || null,
      profileMsg: req.query.profileMsg || null,
      profileErr: req.query.profileErr || null,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Location Save → MongoDB
app.post('/dashboard/location', isLoggedIn, async (req, res) => {
  try {
    const { line, city, state, pincode, addressType, latitude, longitude } = req.body;

    await User.findByIdAndUpdate(req.session.user.id, {
      address: {
        line, city, state, pincode,
        type: addressType,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      }
    });

    res.redirect('/profile?locMsg=Location+saved+successfully#location');
  } catch (err) {
    console.error(err);
    res.redirect('/profile#location');
  }
});

// Profile Details Save → MongoDB
app.post('/dashboard/profile', isLoggedIn, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, newPassword, confirmPassword } = req.body;

    const update = { firstName, lastName, email, phone };

    // Password change (optional)
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword !== confirmPassword) {
        return res.redirect('/profile?profileErr=Passwords+do+not+match#profile');
      }
      if (newPassword.length < 8) {
        return res.redirect('/profile?profileErr=Password+must+be+8+characters#profile');
      }
      update.password = await bcrypt.hash(newPassword, 10);
    }

    await User.findByIdAndUpdate(req.session.user.id, update);

    // Session bhi update karo
    req.session.user = {
      ...req.session.user,
      firstName, lastName, email
    };

    res.redirect('/profile?profileMsg=Details+updated+successfully#profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile?profileErr=Something+went+wrong#profile');
  }
});

// Wishlist Toggle (add if not exists, remove if exists)
app.post('/wishlist/toggle', isLoggedIn, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.session.user.id).select('wishlist');
    const exists = user.wishlist.map(id => id.toString()).includes(productId.toString());
    if (exists) {
      await User.findByIdAndUpdate(req.session.user.id, { $pull: { wishlist: productId } });
    } else {
      await User.findByIdAndUpdate(req.session.user.id, { $addToSet: { wishlist: productId } });
    }
    res.json({ ok: true, wishlisted: !exists });
  } catch (err) {
    res.status(500).json({ message: 'Wishlist error' });
  }
});

// Wishlist Remove
app.delete('/wishlist/remove/:productId', isLoggedIn, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.user.id, {
      $pull: { wishlist: req.params.productId }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove' });
  }
});
app.post('/cart', (req, res) => {
  res.render('cart')
})

// Cart Add
app.post('/cart/add', isLoggedIn, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const reqQty = quantity || 1;
    const product = await Product.findById(productId);
    if (!product || product.quantity < reqQty) {
      return res.status(400).json({ message: 'Out of stock' });
    }
    
    await User.findByIdAndUpdate(req.session.user.id, {
      $addToSet: { cart: { product: productId, quantity: reqQty } }
    });
    const user = await User.findById(req.session.user.id);
    res.json({ ok: true, cartCount: (user.cart || []).length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add' });
  }
});

function isLoggedIn(req, res, next) {

  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }

}


app.get('/logout', (req, res) => {

  req.session.destroy(() => {
    res.redirect('/');
  });

});



// Register Page
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const {
    firstName, lastName, email, phone,
    password, confirmPassword,
    addressLine, city, state, pincode, addressType,
    latitude, longitude,
    terms
  } = req.body;

  try {
    // Basic server-side check
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match.' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('register', { error: 'Email already registered. Please login.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      firstName, lastName, email, phone,
      password: hashedPassword,
      address: {
        line: addressLine,
        city, state, pincode,
        type: addressType,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      }
    });

    await newUser.save();

    // Auto-login after registration
    req.session.user = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role
    };

    req.session.save(() => {
      res.redirect('/store');
    });

  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});


/*app.get('/cart', (req, res) => {
  res.redirect('/cart');
}); */

app.get('/wishlist', (req, res) => {
  res.redirect('/login');
});

app.get('/forgot-password', (req, res) => {
  res.send('<h2>Forgot Password – Coming Soon</h2>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      req.session.user = {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role
      };
      req.session.save(() => {
        res.redirect('/store');
      });
    } catch (err) {
      console.error(err);
      res.redirect('/login');
    }
  }
);

// Checkout page
app.get('/checkout', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('address firstName lastName email phone');
    const addr = user?.address || {};

    const PATNA_LAT = 25.5941, PATNA_LNG = 85.1376;
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    let deliveryMins = 30;
    if (addr.latitude && addr.longitude) {
      deliveryMins = Math.round(30 + haversine(PATNA_LAT, PATNA_LNG, addr.latitude, addr.longitude) * 2);
    }

    res.render('checkout', { user, deliveryMins });
  } catch (err) {
    res.redirect('/cart');
  }
});

// COD order place
app.post('/checkout/place-order', isLoggedIn, async (req, res) => {
  try {
    const { items, totalAmount, address, saveAddress } = req.body;

    // Check stock for all items
    for (let i of items) {
      const prod = await Product.findById(i.id);
      if (!prod || prod.quantity < i.quantity) {
        return res.status(400).json({ message: `Sorry, ${i.name} is out of stock or does not have enough quantity.` });
      }
    }

    const order = new Order({
      user: req.session.user.id,
      items: items.map(i => ({
        product: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image || '',
      })),
      totalAmount,
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'pending',
      deliveryAddress: {
        line: address.line,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      }
    });

    await order.save();
    
    // Decrement stock for ordered items
    for (let i of items) {
      await Product.findByIdAndUpdate(i.id, { $inc: { quantity: -i.quantity } });
    }

    // Naya address save karna ho to
    if (saveAddress && address.line) {
      await User.findByIdAndUpdate(req.session.user.id, {
        address: {
          line: address.line, city: address.city,
          state: address.state, pincode: address.pincode,
          type: address.type || 'home'
        }
      });
    }

    res.json({ ok: true, orderId: order._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Order failed. Try again.' });
  }
});

/* ═══════════════════════════════════════════
   ADMIN ROUTES
═══════════════════════════════════════════ */
function isAdmin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  /* Check DB directly — ensures role changes are picked up immediately */
  User.findById(req.session.user.id).select('role').then(u => {
    if (!u || u.role !== 'admin')
      return res.status(403).send('<h2 style="font-family:sans-serif;padding:40px">403 – Admin access only. <a href="/">Go Home</a></h2>');
    req.session.user.role = 'admin'; // update session cache
    next();
  }).catch(() => res.redirect('/login'));
}

/* GET /admin – Main dashboard */
app.get('/admin', isAdmin, async (req, res) => {
  try {
    const [products, orders, users, admin] = await Promise.all([
      Product.find().sort({ createdAt: -1 }),
      Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 }),
      User.find().select('firstName lastName email phone address role createdAt').sort({ createdAt: -1 }),
      User.findById(req.session.user.id).select('firstName lastName'),
    ]);
    const categories = await Category.find().sort({ createdAt: 1 });
    res.render('admin', { products, orders, users, admin, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin error');
  }
});

/* POST /admin/categories – Save new custom category with icon */
app.post('/admin/categories', isAdmin, async (req, res) => {
  try {
    const { name, icon, label } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name required' });
    /* Upsert — if same name exists, update icon */
    const cat = await Category.findOneAndUpdate(
      { name },
      { icon: icon || '\ud83d\udce6', label: label || name },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ ok: true, category: cat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST /admin/products – Add new product (with optional multi-file upload) */
app.post('/admin/products', isAdmin, upload.array('imageFiles', 10), async (req, res) => {
  try {
    const { title, price, category, description, image, quantity } = req.body;
    /* If files uploaded use their cloudinary paths; else use URL from form */
    let imgPaths = (req.files && req.files.length)
      ? req.files.map(f => f.path)
      : [];
    const primaryImg = imgPaths[0] || image || '';
    const product = new Product({
      title, price: parseFloat(price), category,
      description: description || '',
      quantity: quantity ? parseInt(quantity) : 0,
      image: primaryImg,
      images: imgPaths.length ? imgPaths : (primaryImg ? [primaryImg] : [])
    });
    await product.save();
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT /admin/products/:id – Edit product (with optional multi-file upload) */
app.put('/admin/products/:id', isAdmin, upload.array('imageFiles', 10), async (req, res) => {
  try {
    const { title, price, category, description, image, quantity, existingImages } = req.body;
    let imgPaths = (req.files && req.files.length)
      ? req.files.map(f => f.path)
      : [];
      
    let finalImages = [];
    if (imgPaths.length > 0) {
      finalImages = imgPaths;
    } else if (existingImages) {
      try { finalImages = JSON.parse(existingImages); } catch(e) { finalImages = []; }
    } else if (image) {
      finalImages = [image];
    }
    
    const primaryImg = finalImages.length > 0 ? finalImages[0] : '';
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title, price: parseFloat(price), category, description,
        quantity: quantity ? parseInt(quantity) : 0,
        image: primaryImg,
        images: finalImages
      },
      { returnDocument: 'after' }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE /admin/products/:id – Delete product */
app.delete('/admin/products/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT /admin/orders/:id/status – Update order status */
app.put('/admin/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ ok: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT /admin/users/:id/toggle-admin – Make user admin or revert to user */
app.put('/admin/users/:id/toggle-admin', isAdmin, async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    /* Safety: don't remove last admin */
    if (u.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) return res.status(400).json({ message: 'Cannot remove the last admin. Make another admin first.' });
    }

    u.role = u.role === 'admin' ? 'user' : 'admin';
    await u.save();
    res.json({ ok: true, role: u.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ── Start Server ──
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Mahi-Communication running → Port: ${PORT}`);
  });
}

module.exports = app;