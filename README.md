# Frontend - Sistem Pemesanan Menu UMKM

Frontend application untuk Sistem Informasi Pemesanan Menu dan Monitoring Produksi pada UMKM Kuliner.

## 🚀 Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router** - Routing
- **Axios** - HTTP Client
- **TailwindCSS** - Styling (Phase 2)
- **shadcn/ui** - UI Components (Phase 2)
- **Vitest** - Testing Framework (Phase 5)

## 📁 Project Structure

```
src/
├── app/              # Router configuration
├── features/         # Feature-based modules
│   ├── auth/        # Authentication
│   ├── order/       # Order management
│   ├── production/  # Production dashboard
│   ├── cashier/     # Cashier dashboard
│   └── table/       # Table management
├── components/       # Shared components
│   └── ui/          # UI primitives (shadcn/ui)
├── hooks/           # Global custom hooks
├── services/        # API services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── styles/          # Global styles
└── __tests__/       # Test files
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development
```

### Available Scripts

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests (Phase 5)
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🌍 Environment Variables

Create `.env.development` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_DEBUG_MODE=true
VITE_APP_NAME=UMKM Ordering (DEV)
```

See `.env.example` for all available variables.

## 📋 Development Phases

- [x] **Phase 1**: Project Initialization ✅
- [x] **Phase 2**: UI Foundation (Tailwind + shadcn/ui) ✅
- [x] **Phase 3**: Core Infrastructure (Router, API, Types, Feature Folders) ✅
- [ ] **Phase 4**: Feature Implementation (Manual - implement as needed)
- [x] **Phase 5**: Testing Setup ✅
- [x] **Phase 6**: CI/CD & Deployment ✅

**Setup Progress: 100% Complete** ✅

### Feature Folder Structure (Ready for Implementation)

**All feature folders are EMPTY** - Complete feature-based architecture:

```
src/features/
├── auth/
│   ├── components/      (empty)
│   ├── hooks/           (empty)
│   ├── pages/           (empty)
│   └── services/        (empty)
├── cashier/
│   ├── components/      (empty)
│   ├── hooks/           (empty)
│   ├── pages/           (empty)
│   └── services/        (empty)
├── landing/
│   ├── components/      (empty)
│   ├── hooks/           (empty)
│   ├── pages/           (empty)
│   └── services/        (empty)
├── order/
│   ├── components/      (empty)
│   ├── hooks/           (empty)
│   ├── pages/           (empty)
│   └── services/        (empty)
├── production/
│   ├── components/      (empty)
│   ├── hooks/           (empty)
│   ├── pages/           (empty)
│   └── services/        (empty)
└── table/
    ├── components/      (empty)
    ├── hooks/           (empty)
    ├── pages/           (empty)
    └── services/        (empty)
```

## 🚀 Deployment

### Quick Deploy to Vercel

```bash
vercel --prod
```

### CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs ESLint & TypeScript checks
- ✅ Executes all tests
- ✅ Builds production bundle
- ✅ Deploys to Vercel

**Triggers:**
- Push to `main` → Deploy to production
- Push to `develop` → Deploy to preview
- Pull Request → Run tests only

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel deployment guide.

## 📚 Documentation

- [DOKUMENTASI_FRONTEND.md](./DOKUMENTASI_FRONTEND.md) - Dokumentasi lengkap arsitektur
- [RENCANA_INSTALASI.md](./RENCANA_INSTALASI.md) - Rencana instalasi phase by phase
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment lengkap
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Panduan testing aplikasi
- [PHASE_*_COMPLETE.md](.) - Laporan completion setiap phase

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ Unit tests for utilities
- ✅ Component tests for UI
- ✅ Hook tests for custom hooks
- ✅ Target coverage: 80%

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests and type checking
4. Submit pull request

## 📄 License

Private project for academic purposes.
