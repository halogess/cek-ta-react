# Project Structure

## Directory Organization

```
cek-ta-react/
├── public/                      # Static assets
│   ├── templates/              # Document templates (.docx files)
│   └── vite.svg               # Vite logo
├── src/                        # Source code
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── mahasiswa/        # Student-specific components
│   │   └── shared/           # Shared/common components
│   ├── context/              # React Context providers
│   ├── data/                 # Mock data and static data
│   ├── pages/                # Page-level components (routes)
│   │   ├── admin/           # Admin pages
│   │   ├── auth/            # Authentication pages
│   │   └── mahasiswa/       # Student pages
│   ├── redux/               # Redux state management
│   ├── services/            # API services and business logic
│   │   └── api/            # API client and service modules
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component with layout
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── .amazonq/               # Amazon Q configuration
│   └── rules/             # Project rules and memory bank
├── .env                    # Environment variables
└── Configuration files     # Vite, ESLint, package.json, etc.
```

## Core Components Architecture

### Component Hierarchy

**Admin Components** (`components/admin/`)
- `dashboard/` - Admin dashboard widgets
  - `StatsCards.jsx` - System statistics cards
  - `ErrorStatistics.jsx` - Error analysis charts
  - `SystemInfo.jsx` - System performance metrics
- `template/` - Template management components
  - `TemplateCard.jsx` - Template display card
  - `FormatRulesSection.jsx` - Rules configuration UI
  - `RuleEditor.jsx` - Individual rule editor
  - `MinScoreSettings.jsx` - Score threshold settings
  - Dialog components for editing and previews

**Mahasiswa Components** (`components/mahasiswa/`)
- `dashboard/` - Student dashboard widgets
  - `StatsCards.jsx` - Personal validation statistics
  - `ValidationHistory.jsx` - Recent validations list
  - `ValidationActions.jsx` - Quick action buttons
- `detail/` - Validation detail components
  - `StatusBanner.jsx` - Validation status display
  - `SummaryCard.jsx` - Validation summary
  - `ErrorListPanel.jsx` - Error list with accordion
  - `DocumentStructurePanel.jsx` - Document structure tree
  - `RecommendationPanel.jsx` - Improvement suggestions
- `upload/` - Document upload components
  - `UploadFormCard.jsx` - File upload form
  - `UploadInfoCard.jsx` - Upload instructions
- `validation/` - Validation-related components
  - `ValidationSummary.jsx` - Validation result summary

**Shared Components** (`components/shared/`)
- `auth/` - Authentication components
  - `LoginForm.jsx` - Login form with validation
  - `BrandingPanel.jsx` - Branding and welcome panel
- `layout/` - Layout components
  - `AppHeader.jsx` - Application header/navbar
  - `Sidebar.jsx` - Navigation sidebar
  - `menuItems.js` - Menu configuration
- `ui/` - Reusable UI components
  - `ConfirmDialog.jsx` - Confirmation dialogs
  - `FileUploadArea.jsx` - Drag-and-drop file upload
  - `FilterBar.jsx` - Filtering controls
  - `HistoryList.jsx` & `HistoryItem.jsx` - History display
  - `StatusChip.jsx` - Status badges
  - `Loading.jsx` - Loading indicators
  - Various other UI primitives

## Page Structure

### Routing Architecture
- `/` - Login page (auth/Login.jsx)
- `/admin/*` - Admin routes (protected)
  - `/admin/dashboard` - Admin dashboard
  - `/admin/history` - All validations history
  - `/admin/detail/:id` - Validation detail view
  - `/admin/template` - Template management
- `/mahasiswa/*` - Student routes (protected)
  - `/mahasiswa/dashboard` - Student dashboard
  - `/mahasiswa/upload` - Document upload
  - `/mahasiswa/history` - Personal validation history
  - `/mahasiswa/detail/:id` - Validation detail view
  - `/mahasiswa/template` - Template guidelines view

### Layout Pattern
- `App.jsx` serves as the main layout wrapper with:
  - Responsive sidebar (collapsible on mobile/desktop)
  - Header with user info and logout
  - Main content area with `<Outlet />` for nested routes
  - Drawer width: 280px
  - Background color: #F9FAFB

## State Management

### Redux Store Structure
- **User Slice** (`redux/userSlice.js`)
  - State: `{ user, role, isAuthenticated }`
  - Actions: `login`, `logout`
  - Persistence: localStorage integration
  - Selectors for user data access

### Context Providers
- **HeaderContext** (`context/HeaderContext.jsx`)
  - Manages dynamic header titles across pages
  - Provides `headerInfo` and `setHeaderInfo`
  - Used by pages to update header text

## Service Layer Architecture

### API Services (`services/api/`)
- **Client Layer**
  - `client.js` - Axios-based HTTP client for real API
  - `mockClient.js` - Mock implementation for development
  - Switchable via `VITE_USE_MOCK` environment variable

- **Service Modules**
  - `authService.js` - Authentication (login, logout, me)
  - `validationService.js` - Document validation operations
  - `templateService.js` - Template CRUD operations
  - `dashboardService.js` - Statistics and metrics
  - `settingsService.js` - System settings
  - `userService.js` - User data operations
  - `errorHandler.js` - Centralized error handling

- **Service Pattern**
  - Each service exports functions that call API endpoints
  - Services use either real client or mock client
  - Consistent error handling across all services
  - Returns promises for async operations

### Data Layer (`data/`)
- `mockData.js` - Mock users and validations data
- `validationData.js` - Mock error details and document structure
- Used by mockClient for development/testing

## Architectural Patterns

### Component Patterns
- **Container/Presentational**: Pages (containers) use smaller components (presentational)
- **Composition**: Complex UIs built from smaller, focused components
- **Props Drilling**: Minimal - uses Context and Redux for shared state
- **Hooks-based**: Functional components with React hooks throughout

### Data Flow
1. User interaction in component
2. Component calls service function
3. Service calls API client (real or mock)
4. Response processed and returned
5. Component updates state/UI
6. Redux used for global state (auth)
7. Context used for UI state (header)

### Code Organization Principles
- **Feature-based**: Components grouped by feature/role (admin, mahasiswa)
- **Shared components**: Common UI elements in shared folder
- **Service layer**: Business logic separated from UI
- **Single responsibility**: Each component has focused purpose
- **DRY**: Reusable components for common patterns

### Routing Strategy
- React Router v7 with nested routes
- Protected routes based on Redux auth state
- Role-based routing (admin vs mahasiswa)
- Layout wrapper (App.jsx) with Outlet for nested routes
- 404 handling with NotFound page

## Key Relationships

### Component Dependencies
- Pages depend on feature-specific and shared components
- Feature components depend on shared UI components
- All components can use services for data
- Services depend on API clients
- API clients depend on configuration

### State Dependencies
- Authentication state (Redux) → Route protection
- Header context → Page titles
- Local component state → UI interactions
- Service responses → Component state updates

### Module Exports
- `services/index.js` - Central export for all services
- `components/shared/layout/menuItems.js` - Menu configuration
- Each service module exports named functions
- Components use default exports
