# Beauty Blooms — Local Flower Shop E-Commerce

A modern floral atelier e-commerce application built with React + Vite + Supabase.
Designed in the **Modern Flora** visual language: warm cream surfaces, deep plum text,
bloom pink as the single accent, gold and sage as supporting tones, Playfair Display
for serif headlines, Inter for body text, and JetBrains Mono for tabular numbers.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v3
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, Realtime, RLS)
- **Routing**: React Router DOM v6 (lazy-loaded pages)
- **State**: React Context (Cart, Auth)
- **Type**: JavaScript (JSX)

## Design System

### Token architecture (3 layers)
1. **Primitive** — CSS custom properties in `src/index.css :root`
   (e.g. `--color-bloom-500`, `--color-gold-500`, `--color-bg`)
2. **Semantic** — Tailwind theme.extend.colors in `tailwind.config.js`
   mapping old names to primitives (e.g. `primary` → `var(--color-bloom-500)`)
3. **Component** — class-based component styles in `src/index.css @layer components`
   (e.g. `.btn-primary`, `.card`, `.input-field`, `.eyebrow-strip`, `.price`, `.tag`)

### Palette
- **Primary (Bloom)**: `#b10e6b` — single accent, used for primary CTAs and links
- **Accent (Gold)**: `#C8964A` — premium signifiers, secondary CTAs
- **Tertiary (Sage)**: `#5f8255` — success states, "fresh" indicators
- **Background**: `#FBF7F2` (cream)
- **Surface**: `#FFFFFF` (cards, panels)
- **Foreground**: `#2A1A2E` (deep plum text, warm not pure black)

### Typography
- **Display**: Playfair Display (headlines, italic subheads)
- **Body**: Inter (UI text, body copy)
- **Mono**: JetBrains Mono (prices, order tokens, tabular numbers)

### Primitives (`src/components/ui/`)
- `Button` — variants: primary / secondary / ghost / danger · sizes: sm / md / lg · polymorphic (`as` prop) · loading state
- `Input` — variants: input / textarea / select · accessible label + hint + error · iconLeft / iconRight slots
- `Skeleton` — variants: text / title / circle / card / block · `SkeletonCard` composite
- `Tabs` — ARIA-compliant tablist · controlled or uncontrolled · icon + badge support
- `Modal` — portal-rendered · escape closes · body scroll lock
- `Badge` — 9 status variants mapped to semantic colors
- `Spinner` — SVG-only · 3 sizes
- `EmptyState` — supports Material Symbols names + emoji

### Layout components (`src/components/layout/`)
- `Navbar` — solid-on-scroll, single-line nav (64px mobile / 80px desktop), accessible mobile menu
- `Footer` — slim 3-col (5+3+4 grid), Cebu City location locked

## Directory Layout

```
BeautyBlooms/
├── public/
│   ├── hero-bg.webp                       # Optimized hero image (110 KB)
│   └── hero-bg.jpg                        # JPEG fallback (167 KB)
├── src/
│   ├── lib/
│   │   └── supabaseClient.js              # Supabase singleton (null-safe if env missing)
│   ├── context/
│   │   ├── AuthContext.jsx                # Session + profile.role gating
│   │   └── CartContext.jsx                # LocalStorage cart state (reducer)
│   ├── hooks/
│   │   ├── useProducts.js                 # CRUD + image upload + realtime
│   │   └── useOrders.js                   # place_order RPC + status update + admin realtime
│   ├── components/
│   │   ├── ui/                            # Design-system primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ProductMarquee.jsx         # Auto-scrolling carousel (admin mode included)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx            # Hover quick-add, opaque card
│   │   │   ├── ProductGrid.jsx            # Skeleton loaders, search + filter
│   │   │   └── CategoryFilter.jsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx             # Solid surface slide-in
│   │   │   └── CartItem.jsx               # Inline qty stepper
│   │   └── admin/
│   │       ├── ProductForm.jsx            # Uses Input primitive
│   │       ├── ProductTable.jsx           # Card table, skeleton loaders
│   │       └── OrdersTable.jsx            # Card rows, expandable detail
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── HomePage.jsx               # Asymmetric split hero, testimonial, newsletter
│   │   │   ├── CatalogPage.jsx            # Compact header, skeleton grid
│   │   │   ├── CheckoutPage.jsx           # 3-step indicator, sticky summary
│   │   │   └── OrderStatusPage.jsx        # Live timeline, tracking link
│   │   └── admin/
│   │       ├── AdminDashboard.jsx         # Stat cards + chart + Tabs
│   │       └── AdminLogin.jsx
│   ├── utils/
│   │   ├── formatCurrency.js              # Intl PHP formatter
│   │   └── fees.js                        # Single source for delivery fee
│   ├── App.jsx                            # Router + providers + layout shell
│   ├── main.jsx
│   └── index.css                          # Tokens + base + utilities + components
├── supabase/
│   └── schema.sql                         # DDL + RLS + RPC + seed
├── docs/
│   └── archive/
│       └── stitch_theme.json              # Original Stitch export (archived)
├── .env.example
├── index.html                             # Vite entry, Google Fonts
├── vercel.json                            # Security headers + locked CSP + SPA rewrites
├── tailwind.config.js                     # Modern Flora token system + legacy back-compat
├── postcss.config.js
├── vite.config.js                         # React plugin + @ path alias
└── eslint.config.js
```

## Environment Variables
Copy `.env.example` → `.env` and fill in your Supabase project credentials:

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The app degrades gracefully if these are missing — cart and post-checkout order
confirmation work without Supabase; admin and product catalog will show error states.

## Supabase Setup Order
1. Run `supabase/schema.sql` in the SQL Editor (creates tables, RLS, RPC functions, seed data)
2. Enable Storage bucket `product-images` (public)
3. Configure Auth → Email provider
4. (Optional) Deploy Edge Functions for order-confirmation emails

## Design Skills Used
This project was redesigned using two complementary skills:

- **taste-skill** (`/home/z/my-project/skills/taste-skill/`) — brief inference,
  redesign protocol, pre-flight QA. Drove the public-facing page redesigns
  (HomePage, CatalogPage, CheckoutPage, OrderStatusPage, Navbar, Footer,
  ProductCard, ProductGrid, CategoryFilter, CartDrawer, CartItem).
- **ui-ux-pro-max** (`/home/z/my-project/skills/ui-ux-pro-max-skill/`) — design
  system architecture, component specs, accessibility rules. Drove the admin
  surface redesigns (AdminLogin, AdminDashboard, ProductTable, OrdersTable,
  ProductForm, Badge, Modal).

See `SKILL.md` for the iteration workflow used during the redesign.
