# Luma - Premium Next.js Admin Template configured with Shadcn UI

<div align="center">
  <img src="https://shadcn-template-luma.vercel.app/Dashboard.png" alt="Luma Template Cover" width="100%" />

  <p align="center">
    A premium, high-fidelity landing page and dashboard template built with Next.js 15, Tailwind CSS, and shadcn/ui.
  </p>

[![GitHub stars](https://img.shields.io/github/stars/PranavKale03/shadcn-template-luma?style=flat-square&color=blue)](https://github.com/PranavKale03/shadcn-template-luma/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PranavKale03/shadcn-template-luma?style=flat-square&color=blue)](https://github.com/PranavKale03/shadcn-template-luma/network/members)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-blue?style=flat-square)](https://ui.shadcn.com/)

</div>

## ✨ Features

- **Next.js 15 App Router:** Leveraging the latest Next.js features and server components.
- **Route Groups Architecture:** Clean, isolated routing for `(dashboard)` ensuring separation from landing page logic.
- **Premium Aesthetics:** Custom `Luma` glassmorphism, animated gradients, and high-fidelity hovering effects right out of the box.
- **Dual Theme Support:** Seamless Dark and Light mode powered by `next-themes`.
- **Pre-built Dashboard Structure:** Fully functioning layouts for `/dashboard`, `/profile`, and `/settings` routes.
- **shadcn/ui Integration:** Beautifully styled, accessible components ready for modification.
- **SEO Ready:** Native Next.js metadata implementation on all routes.
- **Responsive Design:** Flawlessly adapts to any screen size from mobile to ultra-wide desktop.

## 🚀 Getting Started

To get started with Luma locally on your machine, follow these simple steps:

### 1. Clone the repository

```bash
git clone https://github.com/PranavKale03/shadcn-template-luma.git
```

### 2. Install dependencies

Navigate to the project directory and install the necessary packages using `pnpm` (or `npm`/`yarn`):

```bash
cd shadcn-template-luma
pnpm install
```

### 3. Run the development server

Start the Next.js development server:

```bash
pnpm run dev
```

The application will be running at `http://localhost:3000`.

## 📂 Project Structure

```text
├── app/
│   ├── (dashboard)/            # Route Group for all dashboard-related protected routes
│   │   ├── dashboard/          # Analytics and metric overview page
│   │   ├── profile/            # User profile management
│   │   ├── settings/           # App configuration settings
│   │   └── layout.tsx          # Shared Sidebar wrapper context
│   ├── globals.css             # Theme variables & custom Luma UI animations
│   ├── layout.tsx              # Root Next.js layout (Providers, Fonts)
│   └── page.tsx                # High-fidelity Landing Page
├── components/
│   ├── landing/                # Modular landing page components (Hero, Navbar, Footer)
│   ├── ui/                     # shadcn/ui primitive components
│   └── app-sidebar.tsx         # Dashboard interactive sidebar
└── lib/                        # Utility functions (Tailwind merges, etc.)
```

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - The React Framework for the Web
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components that you can copy and paste
- [Lucide React](https://lucide.dev/) - Simply beautiful open source icons
- [next-themes](https://github.com/pacocoursey/next-themes) - Perfect Next.js dark mode

## 🤝 Contributing

Contributions are always welcome! If you have any suggestions, improvements, or feature requests, feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the terms of the MIT License.
