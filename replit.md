# Sleep Help Hub - Affiliate Comparison Microsite

## Overview

Sleep Help Hub is a professional affiliate comparison microsite focused on sleep-related products for audiences aged 40+. The application compares anti-snoring devices and sleep-support supplements with a clean, accessible design optimized for Google Search traffic. The site follows a simple funnel structure: Home → Product Category Hubs → Affiliate CTAs, with emphasis on professional presentation, safety claims, and transparent affiliate disclosures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for professional, accessible UI components
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints and static file serving
- **Architecture Pattern**: RESTful API with Express routes under `/api` prefix
- **Development Server**: Vite development server with HMR integration
- **Static Assets**: Served directly through Express in production

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple

### Design System & Accessibility
- **Component Library**: Radix UI primitives with shadcn/ui styling for accessibility compliance
- **Typography**: IBM Plex Sans and Source Sans 3 for age 40+ readability (18-19px base font size)
- **Color Scheme**: Professional grayscale with muted accent colors (navy/teal)
- **Layout**: Grid-based cards with no border-radius for professional appearance
- **Accessibility**: Semantic HTML, visible focus states, high contrast ratios

### Performance Optimizations
- **Critical CSS**: Inlined for above-the-fold content
- **Font Loading**: Preconnect to Google Fonts with font-display: swap
- **Image Loading**: Lazy loading implementation for product images
- **Build Output**: Optimized bundle splitting and asset compression

### Content Management
- **Product Data**: JSON-based data structure in `/data/offers.json`
- **Static Content**: HTML files for each page (`index.html`, `/sleep/devices/`, `/sleep/supplements/`)
- **SEO**: Proper meta tags, canonical URLs, and structured data

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and query building
- **Drizzle Kit**: Database migrations and schema management

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Headless component library for accessibility-compliant primitives
- **shadcn/ui**: Pre-styled components built on Radix UI
- **Google Fonts**: IBM Plex Sans and Source Sans 3 for professional typography
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind CSS integration

### Analytics & Tracking
- **Outbound Click Tracking**: Planned integration with Keitaro and GA4 for affiliate link monitoring
- **Event Deduplication**: Event-ID based system for accurate conversion tracking

### Form Handling & Validation
- **React Hook Form**: Lightweight form library with minimal re-renders
- **Zod**: Runtime type validation for form schemas and API data
- **Hookform/Resolvers**: Integration between React Hook Form and Zod validation

### State Management & Data Fetching
- **TanStack Query**: Server state management with caching and background updates
- **React Query DevTools**: Development tools for debugging queries and cache

The application is designed as a static-first site with optional dynamic features, ensuring fast loading times and excellent SEO performance for the target demographic of users aged 40+ searching for sleep-related products.