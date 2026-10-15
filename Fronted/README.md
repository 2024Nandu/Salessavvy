# SalesSavvy — Frontend Web Application

A modern, responsive, high-performance E-Commerce & Admin Web Application designed and built for the **SalesSavvy** Spring Boot backend.

---

## 🚀 Features

### 🛍️ Customer Experience
- **Dynamic Catalog**: Browse products with live category filtering (`All`, `Electronics`, `Clothing`, `Footwear`, `Home`, etc.).
- **Live Search**: Instant keyword search by title and product description.
- **Product Details Modal**: Full product preview, stock status, high-resolution photography, and quantity adjustments.
- **Cart Management**: Real-time cart drawer with quantity stepper, subtotal calculations, and item deletion.
- **Secure Razorpay Checkout**: Fully integrated with Razorpay (`POST /api/payment/create` and `POST /api/payment/verify`) with celebratory confetti confirmation.
- **Order History**: Review past confirmed orders with order reference codes, itemized breakdowns, unit prices, and quantities (`GET /api/orders`).

### 🛡️ Admin Management Console
- **Revenue & Business Analytics**:
  - Overall total revenue and category-wise sales metrics (`GET /admin/business/overall`).
  - Filter by Yearly, Monthly, and Daily timeframes.
  - Interactive visual progress bars and category share percentages.
- **Inventory & Product Management**:
  - Add new products with image preview, price, stock, and category assignment (`POST /admin/products/add`).
  - Delete products by ID (`DELETE /admin/products/delete`).
- **User Administration**:
  - Search user account details by ID (`GET /admin/user/getbyid`).
  - Modify user credentials and switch roles between `CUSTOMER` and `ADMIN` (`PUT /admin/user/modify`).

### 🔐 Authentication & Session
- Seamless HttpOnly cookie authentication (`authToken`).
- Automatic pre-fill demo buttons for quick customer & admin testing.
- Cross-Origin Resource Sharing (CORS) configured for `http://localhost:5174`.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: Razorpay Standard Web SDK
- **Animations**: Canvas Confetti & Tailwind Transitions

---

## 🏁 Quick Start Guide

### 1. Start the Spring Boot Backend
Ensure your backend is running on port **9090**:
```bash
# In SalesSavvyBackend-main/SalesSavvyBackend-main
./mvnw spring-boot:run
```

### 2. Run the Frontend
Inside the `Fronted` directory:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start the development server
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:5174`**

*(Note: Port 5174 is pre-configured to match the backend CORS policy and security filter in `application.properties` and `AuthenticationFilter.java`)*

---

## 📁 Project Structure

```
Fronted/
├── src/
│   ├── api/
│   │   └── api.js              # Unified API client with cookie credentials
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication & role state management
│   │   ├── CartContext.jsx      # Shopping cart operations & state
│   │   └── ToastContext.jsx     # Floating notifications
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky header, search, cart trigger & user controls
│   │   ├── Footer.jsx           # App footer & status indicators
│   │   ├── ProductCard.jsx      # Product showcase card
│   │   ├── ProductModal.jsx     # Detailed product view
│   │   ├── CartDrawer.jsx       # Side cart & Razorpay payment trigger
│   │   ├── CheckoutSuccessModal.jsx # Confetti confirmation modal
│   │   └── AuthModal.jsx        # Login & Register modal
│   ├── pages/
│   │   ├── CustomerStore.jsx    # Hero section, categories & product catalog
│   │   ├── OrdersPage.jsx       # Customer past order history
│   │   └── admin/
│   │       ├── AdminDashboard.jsx  # Admin container with tabbed console
│   │       ├── AdminAnalytics.jsx  # Revenue & sales reports
│   │       ├── AdminProducts.jsx   # Add & delete product inventory
│   │       └── AdminUsers.jsx      # User lookup & role management
│   ├── utils/
│   │   └── helpers.js           # Currency formatting & image fallbacks
│   ├── App.jsx                  # Main root application
│   ├── main.jsx                 # Vite entry point
│   └── index.css                # Tailwind imports & global styles
├── index.html                   # HTML entry with Razorpay & typography
├── vite.config.js               # Dev server configuration (Port 5174 & proxy)
└── package.json
```
