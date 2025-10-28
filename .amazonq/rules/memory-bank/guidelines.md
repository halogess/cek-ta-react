# Development Guidelines

## Code Quality Standards

### File Naming Conventions
- **Components**: PascalCase with `.jsx` extension (e.g., `TemplatePanduan.jsx`, `AppHeader.jsx`)
- **Services**: camelCase with `.js` extension (e.g., `authService.js`, `mockClient.js`)
- **Data files**: camelCase with `.js` extension (e.g., `mockData.js`, `validationData.js`)
- **Utilities**: camelCase with `.js` extension (e.g., `ruleParser.js`)
- **Configuration**: lowercase with hyphens (e.g., `eslint.config.js`, `vite.config.js`)

### Code Formatting
- **Indentation**: 2 spaces (consistent across all files)
- **Quotes**: Single quotes for strings in JavaScript/JSX
- **Semicolons**: Used consistently at end of statements
- **Line breaks**: Blank lines between logical sections
- **Trailing commas**: Used in arrays and objects for cleaner diffs

### Import Organization
```javascript
// 1. React imports first
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// 2. Third-party libraries
import { Box, Typography, Paper } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';

// 3. Redux/State management
import { Provider } from 'react-redux';
import { store } from './redux/store';

// 4. Context providers
import { useHeader } from '../../context/HeaderContext';

// 5. Services
import { templateService, settingsService } from '../../services';

// 6. Components (grouped by type)
import TemplateCard from '../../components/admin/template/TemplateCard';
import EditNameDialog from '../../components/admin/template/EditNameDialog';

// 7. Utilities
import { parseRuleValue } from '../../utils/ruleParser';

// 8. Styles (if any)
import './index.css';
```

### Variable Naming
- **State variables**: Descriptive camelCase (e.g., `selectedTemplateId`, `hasChanges`, `showSaveSuccess`)
- **Boolean states**: Prefix with `is`, `has`, `show` (e.g., `isActive`, `hasChanges`, `showSaveSuccess`)
- **Handlers**: Prefix with `handle` (e.g., `handleActivate`, `handleSaveName`, `handleToggleRule`)
- **Fetch functions**: Prefix with `fetch` (e.g., `fetchTemplates`, `fetchMinScore`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for exported data

### Component Structure Pattern
```javascript
export default function ComponentName() {
  // 1. Context and hooks
  const { setHeaderInfo } = useHeader();
  
  // 2. State declarations (grouped by purpose)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 3. Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // 4. Edit states
  const [editing, setEditing] = useState(null);
  
  // 5. Notification states
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 6. useEffect hooks
  useEffect(() => {
    setHeaderInfo({ title: 'Page Title' });
    fetchData();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);
  
  // 7. Fetch/API functions
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getData();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 8. Event handlers
  const handleAction = () => {
    // handler logic
  };
  
  // 9. Derived values
  const selectedItem = data.find(item => item.id === selectedId);
  
  // 10. JSX return
  return (
    <>
      {/* Main content */}
      {/* Dialogs */}
      {/* Notifications */}
    </>
  );
}
```

## Semantic Patterns

### State Management Patterns

#### Local State with useState
```javascript
// Multiple related states
const [templates, setTemplates] = useState([]);
const [selectedTemplateId, setSelectedTemplateId] = useState(1);
const [loading, setLoading] = useState(false);

// Dialog visibility states
const [uploadDialog, setUploadDialog] = useState(false);
const [editDialog, setEditDialog] = useState(false);

// Edit mode states
const [editingTemplate, setEditingTemplate] = useState(null);
const [newName, setNewName] = useState('');
```

#### Change Tracking Pattern
```javascript
// Track changes with original state backup
const [hasChanges, setHasChanges] = useState(false);
const [originalTemplates, setOriginalTemplates] = useState([]);

// Before making changes
if (!hasChanges) {
  setOriginalTemplates(JSON.parse(JSON.stringify(templates)));
}
// Make changes
setHasChanges(true);

// Cancel changes
const handleCancel = () => {
  setTemplates(originalTemplates);
  setHasChanges(false);
};
```

#### Temporary Value Pattern
```javascript
// For settings that need confirmation
const [minScore, setMinScore] = useState(80);
const [tempMinScore, setTempMinScore] = useState(80);
const [scoreChanged, setScoreChanged] = useState(false);

// Update temporary value
onTempScoreChange={(value) => {
  setTempMinScore(value);
  setScoreChanged(value !== minScore);
}}

// Save confirmed value
const handleSave = async () => {
  await service.update(tempMinScore);
  setMinScore(tempMinScore);
  setScoreChanged(false);
};
```

### Data Fetching Pattern
```javascript
// Standard async fetch with loading and error handling
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await service.getData();
    setData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

// Fetch on mount with cleanup
useEffect(() => {
  setHeaderInfo({ title: 'Page Title' });
  fetchData();
  return () => setHeaderInfo({ title: '' });
}, [setHeaderInfo]);
```

### Mock Data Pattern
```javascript
// Export mock data arrays
export const mockUsers = [
  { id: 1, nrp: '5025201001', nama: 'Ahmad Ridwan', ... },
  { id: 2, nrp: '5025201002', nama: 'Siti Nurhaliza', ... }
];

// Export helper functions
export const getValidationsByUser = (nrp) => {
  return mockValidations.filter(v => v.nrp === nrp);
};

export const getValidationById = (id) => {
  return mockValidations.find(v => v.id === parseInt(id));
};

// Export statistics calculators
export const getStatistics = () => {
  const completed = mockValidations.filter(v => 
    v.status === 'Lolos' || v.status === 'Tidak Lolos'
  );
  return {
    total: completed.length,
    passed: completed.filter(v => v.status === 'Lolos').length,
    needsFix: completed.filter(v => v.status === 'Tidak Lolos').length
  };
};
```

### Mock API Client Pattern
```javascript
// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockApiClient = {
  get: async (endpoint, options = {}) => {
    await delay();
    
    // Route-based responses
    if (endpoint.startsWith('/validations/user/')) {
      const userId = endpoint.split('/').pop();
      return getValidationsByUser(userId);
    }
    
    // Handle query parameters
    if (endpoint.startsWith('/validations')) {
      let data = getAllValidations();
      
      if (options.params) {
        const { status, prodi, search, sort } = options.params;
        
        if (status && status !== 'Semua') {
          data = data.filter(v => v.status === status);
        }
        
        if (search) {
          data = data.filter(v => 
            v.nama?.toLowerCase().includes(search.toLowerCase()) ||
            v.nrp?.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (sort === 'terbaru') {
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
      }
      
      return data;
    }
    
    throw new Error('Endpoint not found');
  },
  
  post: async (endpoint, data) => {
    await delay();
    // Handle POST requests
  },
  
  put: async (endpoint, data) => {
    await delay();
    // Handle PUT requests
  },
  
  delete: async (endpoint) => {
    await delay();
    return { message: 'Deleted successfully' };
  },
  
  upload: async (endpoint, formData) => {
    await delay(1000); // Longer delay for uploads
    return { id: Date.now(), message: 'Upload successful' };
  }
};
```

### Immutable State Update Pattern
```javascript
// Update array of objects immutably
const handleActivate = (id) => {
  setTemplates(templates.map(t => 
    ({ ...t, isActive: t.id === id })
  ));
};

// Update nested object properties
const handleToggleRule = (type, parentId, ruleIndex) => {
  const newTemplates = templates.map(t => {
    if (t.id === selectedTemplateId) {
      return {
        ...t,
        formatRules: {
          ...t.formatRules,
          components: t.formatRules?.components?.map(c => 
            c.id === parentId 
              ? { 
                  ...c, 
                  rules: c.rules.map((r, i) => 
                    i === ruleIndex ? { ...r, enabled: !r.enabled } : r
                  ) 
                }
              : c
          ) || []
        }
      };
    }
    return t;
  });
  setTemplates(newTemplates);
};

// Filter array
const handleDelete = (id) => {
  setTemplates(templates.filter(t => t.id !== id));
};
```

### Routing Pattern
```javascript
// Nested routes with shared layout
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/mahasiswa',
    element: <App />, // Layout wrapper
    children: [
      { index: true, element: <MahasiswaDashboard /> },
      { path: 'upload', element: <Upload /> },
      { path: 'history', element: <History /> },
      { path: 'detail/:id', element: <DetailValidation /> }
    ],
  },
  {
    path: '/admin',
    element: <App />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'template', element: <AdminTemplatePanduan /> },
      { path: 'history', element: <AdminHistory /> },
      { path: 'detail/:id', element: <AdminDetailValidation /> }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);
```

### Provider Composition Pattern
```javascript
// Wrap app with multiple providers
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HeaderProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </HeaderProvider>
    </Provider>
  </StrictMode>
);
```

## Material-UI Usage Patterns

### Component Import Pattern
```javascript
// Import specific components
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
```

### Styling Pattern
```javascript
// Inline sx prop for styling
<Paper 
  elevation={0} 
  sx={{ 
    p: 3, 
    borderRadius: '12px', 
    border: '1px solid #E2E8F0' 
  }}
>
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 3 
  }}>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      Title
    </Typography>
  </Box>
</Paper>

// Common spacing: p (padding), m (margin), mb (margin-bottom), etc.
// Common values: 1 = 8px, 2 = 16px, 3 = 24px
```

### Layout Pattern
```javascript
// Stack for vertical layout
<Stack spacing={2}>
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</Stack>

// Box with flexbox
<Box sx={{ display: 'flex', gap: 2 }}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</Box>
```

## Error Handling

### Try-Catch Pattern
```javascript
// Always wrap async operations
const fetchData = async () => {
  try {
    setLoading(true);
    const result = await service.getData();
    setData(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Optionally show error notification
  } finally {
    setLoading(false);
  }
};
```

### Optional Chaining
```javascript
// Safe property access
const rules = template?.formatRules?.page_settings?.find(s => s.id === id)?.rules;

// With fallback
const components = t.formatRules?.components || [];
```

## Component Communication

### Props Pattern
```javascript
// Pass handlers and data as props
<TemplateCard
  template={template}
  isSelected={selectedTemplateId === template.id}
  onSelect={() => setSelectedTemplateId(template.id)}
  onEdit={() => handleEditName(template)}
  onDelete={() => handleDelete(template.id)}
/>
```

### Dialog Pattern
```javascript
// Dialog state and handlers
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogData, setDialogData] = useState(null);

const handleOpenDialog = (data) => {
  setDialogData(data);
  setDialogOpen(true);
};

// Dialog component
<EditDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  data={dialogData}
  onSave={handleSave}
/>
```

### Context Usage Pattern
```javascript
// Use context for cross-cutting concerns
const { setHeaderInfo } = useHeader();

useEffect(() => {
  setHeaderInfo({ title: 'Page Title' });
  return () => setHeaderInfo({ title: '' });
}, [setHeaderInfo]);
```

## Best Practices

### Component Organization
- Keep components focused and single-purpose
- Extract reusable UI into shared components
- Group related components in folders (e.g., `admin/template/`)
- Use default exports for components
- Use named exports for utilities and services

### State Management
- Use local state for UI-specific state
- Use Redux for global auth state
- Use Context for cross-cutting UI concerns (header)
- Keep state as close to where it's used as possible
- Avoid prop drilling with Context or composition

### Performance
- Use React.memo for expensive components (when needed)
- Avoid inline function definitions in render (use useCallback if needed)
- Keep component render logic simple
- Use keys properly in lists

### Code Reusability
- Extract common patterns into custom hooks
- Create reusable UI components in shared folder
- Use composition over inheritance
- Keep business logic in services, not components

### Testing Considerations
- Mock API client allows testing without backend
- Separate business logic from UI for easier testing
- Use descriptive variable and function names
- Keep functions small and focused

### Documentation
- Use descriptive variable names (code as documentation)
- Add comments for complex logic only
- Keep README files updated
- Document API endpoints separately (API_ENDPOINTS.md)

### File Organization
- Group by feature/role (admin, mahasiswa)
- Separate concerns (components, services, data)
- Keep related files together
- Use index files for clean exports
