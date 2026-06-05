# 🛒 Mahi-Communication – Full-Stack Grocery Delivery Platform

Mahi-Communication is a robust, dynamic e-commerce web application built for ordering fresh groceries. It includes a user dashboard, interactive shopping catalog, dynamic delivery estimation based on address coordinates, and a powerful Admin dashboard.

## 🚀 Key Features

* **User Authentication:** 
  * Google OAuth 2.0 integration via Passport.js.
  * Local Signup and Login with bcrypt password hashing.
  * Persistent sessions using `express-session` and `connect-mongo`.
* **Smart Logistics (Delivery Time Estimator):**
  * Uses the **Haversine formula** to calculate the distance between the central warehouse in Patna (25.5941, 85.1376) and the user's saved address to dynamically update delivery times.
* **Shopping Experience:**
  * Interactive product catalog sorted by categories.
  * Fully functional Cart (add/remove items, update quantity).
  * Wishlist management (adding/removing products).
  * Cash on Delivery (COD) checkout system.
* **Admin Dashboard:**
  * Full CRUD control (Create, Read, Update, Delete) on products.
  * Dynamic creation of custom categories with custom emojis.
  * Real-time order tracking (pending, confirmed, dispatched, out for delivery, delivered, cancelled).
  * User roles management (making other users admin or reverting them).

---

## 🛠️ Tech Stack

* **Frontend:** EJS (Embedded JavaScript) Templates, Vanilla CSS, JavaScript (DOM Manipulation)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose ODM
* **Authentication:** Passport.js, Bcrypt

---

## 💻 Getting Started (Local Setup)

Follow these steps to run the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishant259-hub/ansumart.git
   cd mahi-communication
