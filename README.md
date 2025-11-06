# HappyFox Organizational Chart

A modern, interactive organizational chart application built with React that allows you to visualize, search, and manage employee hierarchies with drag-and-drop functionality.

## 🚀 Features

- **Interactive Org Chart**: Visualize employee hierarchy with an intuitive tree structure
- **Drag & Drop**: Reorganize employees by dragging them to new managers (with undo capability)
- **Employee Search**: Advanced search and filtering by name, email, designation, team, or employee ID
- **Mobile Responsive**: Fully optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Optimistic UI updates with automatic rollback on errors
- **Undo Capability**: 8-second window to undo any organizational changes
- **Performance Optimized**: Memoization, lazy loading, and code splitting for fast rendering
- **Test Coverage**: Comprehensive test suite with 88+ passing tests

## 📦 Packages Used

### Core Dependencies

- **[React 19.1.1](https://react.dev/)** - UI library
- **[React Router DOM 7.9.5](https://reactrouter.com/)** - Client-side routing and URL synchronization
- **[React DnD 16.0.1](https://react-dnd.github.io/react-dnd/)** - Drag and drop functionality
- **[React DnD HTML5 Backend 16.0.1](https://react-dnd.github.io/react-dnd/)** - HTML5 backend for drag and drop
- **[React Organizational Chart 2.2.1](https://www.npmjs.com/package/react-organizational-chart)** - Tree structure visualization component
- **[Mirage JS 0.1.48](https://miragejs.com/)** - Mock API server for development and testing

### Development Dependencies

- **[Vite 7.1.7](https://vite.dev/)** - Build tool and dev server with HMR (Hot Module Replacement)
- **[Jest 30.2.0](https://jestjs.io/)** - Testing framework
- **[React Testing Library 16.3.0](https://testing-library.com/react)** - Component testing utilities
- **[@testing-library/jest-dom 6.9.1](https://github.com/testing-library/jest-dom)** - Custom Jest matchers

## 📁 Project Structure

```
my-app/
├── src/
│   ├── components/          # React components
│   │   ├── EmployeeList.jsx        # Sidebar with search and filters
│   │   ├── EmployeeListItem.jsx    # Individual employee list item
│   │   ├── OrganizationalChart.jsx # Main chart component
│   │   ├── OrgNode.jsx             # Individual employee node
│   │   ├── OrgTree.jsx             # Tree structure wrapper
│   │   ├── NotificationContainer.jsx # Notification display
│   │   └── ErrorBoundary.jsx       # Error handling component
│   │
│   ├── contexts/            # React Context for state management
│   │   ├── SelectedEmployeeContext.jsx  # Employee selection state
│   │   └── NotificationContext.jsx      # Notification system
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useDebounce.js           # Debounced search input
│   │
│   ├── mirage/              # Mock API server
│   │   ├── server.js                # API endpoints and configuration
│   │   └── seeds.js                 # Sample employee data
│   │
│   ├── utils/               # Utility functions
│   │   └── dataUtils.js             # Data transformation helpers
│   │
│   ├── test-utils/          # Testing utilities
│   │   ├── mockData.js              # Mock data for tests
│   │   └── test-utils.jsx           # Custom render helpers
│   │
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Application entry point
│   └── *.css                # Component styles
│
├── public/                  # Static assets
├── coverage/                # Test coverage reports
├── __mocks__/               # Jest mocks
├── jest.config.cjs          # Jest configuration
├── jest.setup.js            # Jest setup file
├── vite.config.js           # Vite configuration
├── babel.config.cjs         # Babel configuration
├── eslint.config.js         # ESLint configuration
└── package.json             # Project dependencies
```

## 🔧 Mirage JS Mock Server

This application uses **Mirage JS** to simulate a backend API, making it fully functional without needing a real server.


## 🎨 Architecture Highlights

### Data Structure & Scalability

#### Server Response Format (Flat Array)
The server sends employee data as a **flat array** of objects, which is highly scalable for large organizations:

```json
[
  {
    "id": "1",
    "employeeId": "EMP001",
    "name": "Alice Johnson",
    "designation": "CEO",
    "managerId": null,
    "email": "alice.johnson@company.com",
    "profilePic": "https://i.pravatar.cc/150?img=1",
    "team": "Executive"
  },
  {
    "id": "2",
    "employeeId": "EMP002",
    "name": "Mark Johnson",
    "designation": "CFO",
    "managerId": "1",
    "email": "mark.johnson@company.com",
    "profilePic": "https://i.pravatar.cc/150?img=2",
    "team": "Executive"
  }
]
```

#### Client-Side Transformation (Map Structure)
On the client, we transform this flat array into an optimized **Map structure** using the `buildEmployeeMaps()` utility:

```javascript
// Input: Flat array of employees
// Output: Two Maps for O(1) lookups

{
  byManager: Map {
    null => [Alice Johnson],      // CEO with no manager
    "1" => [Mark Johnson, ...],   // Alice's direct reports
    "2" => [Emma Davis, ...]      // Mark's direct reports
  },
  directMenteesMap: Map {
    null => ["1"],                // CEO's ID
    "1" => ["2", "3"],           // Alice's report IDs
    "2" => ["5", "6"]            // Mark's report IDs
  }
}
```

#### Why This Approach is Scalable

**✅ Advantages:**
- **O(n) Build Time**: Single pass through data to build maps
- **O(1) Lookup**: Instant access to any manager's reports
- **Memory Efficient**: No data duplication, references only
- **Network Efficient**: Smaller JSON payload (no nested objects)
- **Easy to Update**: Simple array operations for CRUD

### State Management
- **React Context API** for global state (selected employee, notifications)
- **Custom Hooks** for reusable logic (debouncing, notifications)
- **Local State** for component-specific data

### Performance Optimizations
- **React.memo**: All components memoized to prevent unnecessary re-renders
- **Debounced Search**: 300ms delay reduces search operations by 90%
- **Lazy Loading**: Images use native lazy loading
- **Code Splitting**: Lazy loaded components for smaller initial bundle
- **Memoized Calculations**: Stable references with useMemo/useCallback
- **Map-based Lookups**: O(1) complexity for finding employee relationships

### Error Handling
- **Error Boundaries**: Catch and handle React errors gracefully
- **Optimistic Updates**: Instant UI feedback with automatic rollback
- **User Notifications**: Clear error messages with recovery options
- **Undo Feature**: 8-second window to reverse any changes

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server with HMR
npm run dev

# The app will be available at http://localhost:5173
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📊 Test Coverage

The application includes unit and integrations tests.

## 🎯 Key Functionalities

### 1. Employee Search & Filter
- Search by name, email, designation, team, or employee ID
- Real-time filtering with 300ms debounce
- Team-based filtering dropdown
- Shows match count

### 2. Drag & Drop Manager Assignment
- **Desktop**: Drag employee cards to new managers
- **Mobile**: Tap-to-select, then tap target manager
- Prevents invalid moves (self-assignment, circular reporting)
- Visual feedback during drag operations

### 3. Undo System
- 8-second window to undo manager changes
- One-click undo from notification
- Makes API call to restore previous state
- Confirmation notification on success

### 4. Visual Highlighting
- Click any employee to highlight in the chart
- Auto-scroll to selected employee
- URL synced with `?employeeId=` parameter
- Persists across page reloads

### 5. Responsive Design
- Breakpoints: 768px (mobile), 1200px (desktop)
- Collapsible sidebar on mobile
- Touch-friendly tap interactions
- Optimized text truncation per screen size