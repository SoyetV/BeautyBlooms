# Bloom — Local Flower Shop E-Commerce

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v3
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Routing**: React Router DOM v6
- **State**: React Context (Cart, Auth)

## Directory Layout

```
bloom/
├── public/
│   └── placeholder-flower.svg
├── src/
│   ├── lib/
│   │   └── supabaseClient.js       # Supabase singleton
│   ├── context/
│   │   ├── AuthContext.jsx         # Session & profile state
│   │   └── CartContext.jsx         # LocalStorage cart state
│   ├── hooks/
│   │   ├── useProducts.js          # Fetch + CRUD products
│   │   ├── useOrders.js            # Fetch + update orders
│   │   └── useProfile.js          # Auth profile helpers
│   ├── components/
│   │   ├── ui/                     # Primitive design-system pieces
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── CategoryFilter.jsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx
│   │   │   └── CartItem.jsx
│   │   └── admin/
│   │       ├── ProductForm.jsx     # Add / Edit modal form
│   │       ├── ProductTable.jsx    # Inventory table
│   │       └── OrdersTable.jsx     # Orders dashboard
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   └── OrderStatusPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       └── AdminLogin.jsx
│   ├── utils/
│   │   └── formatCurrency.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Environment Variables
Copy `.env.example` → `.env` and fill in your Supabase project credentials.

## Supabase Setup Order
1. Run `supabase/schema.sql` in the SQL Editor
2. Enable Storage bucket `product-images` (public)
3. Configure Auth → Email provider
4. Deploy Edge Functions (optional — order confirmation emails)
