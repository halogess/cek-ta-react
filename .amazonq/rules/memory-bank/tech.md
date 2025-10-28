# Technology Stack

## Programming Languages
- **JavaScript (JSX)** - Primary language for React components
- **CSS** - Styling (via Material-UI's styling system and index.css)
- **JSON** - Configuration and data files

## Core Framework & Libraries

### Frontend Framework
- **React 19.1.1** - UI library with hooks and functional components
- **React DOM 19.1.1** - React rendering for web

### Routing
- **React Router DOM 7.9.4** - Client-side routing with nested routes

### State Management
- **Redux Toolkit 2.9.1** - Global state management (simplified Redux)
- **React Redux 9.2.0** - React bindings for Redux

### UI Framework
- **Material-UI (MUI) 7.3.4** - Component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon set
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS styling

### Document Processing
- **docx-preview 0.3.7** - DOCX file preview in browser

## Build System & Development Tools

### Build Tool
- **Vite 7.1.7** - Fast build tool and dev server
- **@vitejs/plugin-react 5.0.4** - React plugin for Vite with Fast Refresh

### Code Quality
- **ESLint 9.36.0** - JavaScript linting
  - `@eslint/js` - ESLint core rules
  - `eslint-plugin-react-hooks` - React hooks linting
  - `eslint-plugin-react-refresh` - React refresh linting
- **globals 16.4.0** - Global variables for ESLint

### Type Checking (Dev)
- **@types/react 19.1.16** - React TypeScript definitions
- **@types/react-dom 19.1.9** - React DOM TypeScript definitions

## Development Commands

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Development Server
- Runs on Vite dev server (default: http://localhost:5173)
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

## Environment Configuration

### Environment Variables (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

### Configuration Files

**vite.config.js**
- Minimal Vite configuration
- React plugin enabled
- Default settings for dev server and build

**eslint.config.js**
- ESLint 9.x flat config format
- React-specific rules enabled
- React hooks rules configured

**package.json**
- Project metadata and dependencies
- Scripts for dev, build, lint, preview
- Module type: ES modules

## Project Setup

### Installation
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
- Starts Vite dev server
- Enables HMR
- Uses mock API if VITE_USE_MOCK=true

### Production Build
```bash
npm run build
```
- Builds optimized production bundle
- Output to `dist/` directory
- Minified and tree-shaken

## API Integration

### Mock Mode (Development)
- Uses `mockClient.js` for API calls
- Data from `mockData.js` and `validationData.js`
- No backend required
- Controlled by `VITE_USE_MOCK=true`

### Real API Mode (Production)
- Uses `client.js` with Axios
- Connects to backend at `VITE_API_BASE_URL`
- Requires backend server running
- Controlled by `VITE_USE_MOCK=false`

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported via responsive design

## Key Dependencies Explained

### Redux Toolkit
- Simplifies Redux setup with configureStore
- Includes createSlice for reducers
- Built-in Immer for immutable updates
- DevTools integration

### Material-UI
- Pre-built React components
- Theming system with useTheme hook
- Responsive utilities (useMediaQuery)
- Icon library with 2000+ icons
- Emotion for styling

### React Router v7
- Declarative routing
- Nested routes with Outlet
- useNavigate for programmatic navigation
- useLocation for route information
- Protected route patterns

### Vite
- Lightning-fast dev server
- Native ES modules in development
- Optimized production builds
- Plugin ecosystem
- Better performance than webpack

## File Structure Conventions

### Component Files
- `.jsx` extension for React components
- PascalCase naming (e.g., `AppHeader.jsx`)
- Default exports for components

### Service Files
- `.js` extension for services
- camelCase naming (e.g., `authService.js`)
- Named exports for functions

### Data Files
- `.js` extension for data modules
- camelCase naming (e.g., `mockData.js`)
- Named exports for data objects/functions

### Configuration Files
- Various extensions (.js, .json, .md)
- Lowercase with hyphens or dots
- Root level placement

## Development Workflow

1. **Start Development**
   - Run `npm run dev`
   - Vite starts dev server
   - Open browser to localhost:5173

2. **Make Changes**
   - Edit component files
   - HMR updates browser automatically
   - Check console for errors

3. **Test Features**
   - Use mock data for testing
   - Login with mock credentials
   - Test both admin and student flows

4. **Build for Production**
   - Run `npm run build`
   - Test with `npm run preview`
   - Deploy `dist/` folder

## Performance Optimizations

- Vite's fast HMR for development
- Code splitting via React Router
- Tree shaking in production builds
- Material-UI's optimized components
- Lazy loading potential for routes
- Redux for efficient state updates
