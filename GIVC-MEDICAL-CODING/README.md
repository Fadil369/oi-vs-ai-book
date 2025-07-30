# GIVC Medical Coding Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020)](https://pages.cloudflare.com/)

A modern, professional medical coding education platform built with Next.js, TypeScript, and Tailwind CSS. Deployed on Cloudflare Pages with full internationalization support.

## 🚀 Live Demo

**Production**: [https://givc-medical-coding.pages.dev](https://givc-medical-coding.pages.dev)
**Latest Deployment**: [https://688281cc.givc-medical-coding.pages.dev](https://688281cc.givc-medical-coding.pages.dev)

## 🌟 Features

- **Bilingual Support**: Full English and Arabic localization
- **Modern UI**: Built with Tailwind CSS v4 and Framer Motion animations
- **Responsive Design**: Mobile-first, fully responsive interface
- **Performance Optimized**: Static generation, lazy loading, and optimized images
- **SEO Ready**: Comprehensive meta tags, Open Graph, and Twitter Card support
- **Accessible**: WCAG compliant design patterns
- **Type-Safe**: Full TypeScript implementation

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Build Tool**: Turbopack (dev)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or yarn or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd givc-medical-coding
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NODE_ENV=development
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── courses/       # Courses page
│   │   ├── contact/       # Contact page
│   │   ├── layout.tsx     # Layout component
│   │   ├── loading.tsx    # Loading UI
│   │   └── error.tsx      # Error UI
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization config
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🌍 Internationalization

The platform supports English and Arabic with:

- **Locale-based routing**: `/en/*` and `/ar/*`
- **RTL Support**: Automatic text direction for Arabic
- **Cultural Adaptation**: Localized content and formatting
- **Language Switching**: Seamless language toggle

### Adding New Languages

1. Add locale to `src/i18n/routing.ts`
2. Create translation file in `messages/[locale].json`
3. Update locale list in middleware configuration

## 🎨 Styling

Built with Tailwind CSS v4:

- **Design System**: Consistent spacing, colors, and typography
- **Dark Mode**: Ready for dark mode implementation
- **Custom Colors**: Medical/healthcare themed color palette
- **Responsive Breakpoints**: Mobile-first approach

### Key Color Palette

```css
primary: Blue shades (medical/trust theme)
secondary: Green shades (health/growth theme)
gray: Neutral tones for text and backgrounds
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   - Import your repository to Vercel
   - Vercel will auto-detect Next.js configuration

2. **Environment Variables**
   Set the following in Vercel dashboard:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Create Dockerfile** (if needed)

2. **Build and run**
   ```bash
   docker build -t givc-medical-coding .
   docker run -p 3000:3000 givc-medical-coding
   ```

## 🔧 Configuration

### Environment Variables

| Variable               | Description            | Default                 |
| ---------------------- | ---------------------- | ----------------------- |
| `NODE_ENV`             | Environment mode       | `development`           |
| `NEXT_PUBLIC_SITE_URL` | Site URL for meta tags | `http://localhost:3000` |

### Next.js Configuration

Key configurations in `next.config.ts`:

- **Internationalization**: Locale routing and detection
- **Images**: Domain optimization for external images
- **Performance**: Bundle analysis and optimization

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with code splitting
- **SEO**: Comprehensive meta tags and structured data

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 📱 Features Roadmap

### Phase 1 (Completed) ✅

- [x] Basic UI and navigation
- [x] Internationalization (EN/AR)
- [x] Responsive design
- [x] SEO optimization

### Phase 2 (Planned)

- [ ] User authentication system
- [ ] Course enrollment functionality
- [ ] Payment integration
- [ ] Video streaming for courses
- [ ] Progress tracking
- [ ] Quiz and assessment system

### Phase 3 (Future)

- [ ] AI-powered coding assistance
- [ ] Virtual lab environment
- [ ] Live instructor sessions
- [ ] Mobile app companion
- [ ] Analytics dashboard
- [ ] Certification management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by GIVC Medical.

## 📞 Support

For support, email support@givctmedical.com or join our Discord community.

---

**Built with ❤️ by the GIVC Medical team**
