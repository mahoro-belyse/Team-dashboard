# Team Dashboard Web App

A **professional, modern, and attractive** team collaboration dashboard built with **React, TypeScript, Vite, TailwindCSS, and Shadcn/ui components**, with a full mock API, protected routes, and responsive design.

This web app includes:

- Authentication pages: **Login, Sign Up, Forgot Password** (all in one file)
- Protected pages: **Dashboard, Projects, Tasks, Team, Calendar, Communication, Reports, Notifications, Settings, Profile**
- **Professional UI** with modern layout, smooth transitions, and Shadcn-style components
- **Light and Dark mode** with fully responsive layouts
- **Mock API layer** (`src/services/fakeApi.ts`) simulating async calls, loading states, and error handling
- **Local storage** for user session and data persistence
- **Custom hooks** (`src/hooks`) for reusable logic

---

## 🌐 Live Demo

Experience the **professional, modern, and attractive Team Dashboard Web App** live:

🔗 **Live Application:**  
https://team-colla-bo.netlify.app/

---

## Features

- Professional and attractive **sidebar** navigation in the dashboard
- Modern **navbar** in public pages
- Fully functional **buttons, links, and forms**
- **Charts and analytics** on the dashboard (Recharts)
- **Task and project management** with detail pages
- **Team and communication modules** with chat
- Hero section with **background image**
- User **profile avatar and image handling** from `src/assets`
- **Footer** with professional, modern, and attractive design

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

---

## Installation

Clone the repository:

```bash
git clone https://github.com/mahoro-belyse/Team-dashboard.git
cd team-dashboard
```

Install dependencies:

```bash
npm install
```

---

## TailwindCSS Setup

This project uses **TailwindCSS v4 utilities directly in `index.css`**, no `tailwind.config.js` is required. All color themes, variables, and styles are defined in `src/index.css`.

---

## Running the App

### Development Mode

```bash
npm run dev
```

Open the app at: [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

---

## Folder Structure

```
public/
└── img/                   # Images and assets used in pages (hero, thumbnails, backgrounds, etc.)

src/
├── assets/                
├── components/            # Reusable UI components
│   ├── layout/            # Layout-related components
│   │   ├── Navbar.tsx     # Top navigation bar (shown on all public pages)
│   │   ├── DashboardLayout.tsx    # Professional, attractive, modern sidebar (for dashboard/protected pages)
│   │   └── Footer.tsx     # Modern footer component used across the app
│   └── ui                # Other reusable components (cards, buttons, modals, etc.)
├── context/               # Global state management
│   └── AuthContext.tsx    # Authentication context and provider
├── hooks/                 # Custom reusable hooks to avoid logic repetition
├── lib/                   # Utility functions and helpers
├── pages/                 # Application pages (Dashboard, Projects, Tasks, Team, Calendar, Communication, Reports, Notifications, Settings, Profile)
├── services/              # Mock API (fakeApi.ts)
├── types/                 # TypeScript interfaces/types
└── index.css              # TailwindCSS base + theme variables (light/dark mode, colors, typography)

```

---

## Authentication Flow

1. User visits the site → sees **Home** or **Auth page**.
2. Login, Sign Up, and Forgot Password are handled in **one file** (`src/pages/Auth.tsx`).
3. Upon successful login, user data is saved in **localStorage** and routed to **protected pages**.
4. Protected pages (Dashboard, Tasks, Projects, Team, Calendar, Communication, Settings) can only be accessed when logged in.

---

## Mock API Layer

- All API calls are **simulated** with delays using `src/services/fakeApi.ts`
- Supports:
  - Users: login, register, reset password
  - Projects: get list, get details
  - Tasks: get list, filter by status
  - Team members
  - Messages & notifications
  - Dashboard stats

- Handles **loading states**, **error states**, and **retry logic**

---

## Custom Hooks

- Reusable logic for auth, data fetching, and form handling
- Avoids code duplication
- Images are **not stored in hooks**, they are used from `src/assets`

---

## Notes

- **Light/Dark Mode**: `index.css` contains all color variables and CSS layers.
- **Professional, modern, attractive** UI using Shadcn-style components and TailwindCSS.
- All **buttons, links, and forms are functional**, including project details navigation and task actions.

---

## Dependencies

- React 18.x
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui (Radix UI primitives)
- lucide-react (icons)
- Recharts (charts/analytics)



