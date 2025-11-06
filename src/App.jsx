import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SelectedEmployeeProvider, useSelectedEmployee } from './contexts/SelectedEmployeeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

// Lazy load heavy components for better initial load performance
const OrganizationalChart = lazy(() => import('./components/OrganizationalChart'))
const EmployeeList = lazy(() => import('./components/EmployeeList'))
const NotificationContainer = lazy(() => import('./components/NotificationContainer'))

function AppContent() {
  const [data, setData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedEmployeeId, setSelectedEmployeeId } = useSelectedEmployee();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/employees')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      return response.json();
    })
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error?.message || 'Failed to load employees');
      setLoading(false);
    });
  }, []);

  // Initialize selectedEmployeeId from URL on mount (only once)
  useEffect(() => {
    const employeeIdFromUrl = searchParams.get('employeeId');
    if (employeeIdFromUrl) {
      setSelectedEmployeeId(employeeIdFromUrl);
    }
  }, []);

  // Sync URL with selectedEmployeeId changes
  useEffect(() => {
    const currentEmployeeId = searchParams.get('employeeId');
    
    if (selectedEmployeeId && selectedEmployeeId !== currentEmployeeId) {
      setSearchParams({ employeeId: selectedEmployeeId }, { replace: true });
    } else if (!selectedEmployeeId && currentEmployeeId) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedEmployeeId, searchParams, setSearchParams]);


  // Filter data based on selected team
  const filteredData = useMemo(() => {
    if (!selectedTeam) {
      return data;
    }

    const teamEmployees = new Set(
      data.filter(emp => emp.team === selectedTeam).map(emp => emp.id)
    );

    // Include all managers up the chain to maintain hierarchy
    const employeesToInclude = new Set(teamEmployees);
    
    data.forEach(emp => {
      if (teamEmployees.has(emp.id)) {
        let currentManager = emp.managerId;
        while (currentManager) {
          employeesToInclude.add(currentManager);
          const manager = data.find(e => e.id === currentManager);
          currentManager = manager?.managerId;
        }
      }
    });

    return data.filter(emp => employeesToInclude.has(emp.id));
  }, [data, selectedTeam]);


  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading organization chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="loading-container error-container">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load</h2>
          <p>{error}</p>
          <span>Please reload the page or try again later</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Suspense fallback={<div className="loading-indicator">Loading...</div>}>
        <NotificationContainer />
      </Suspense>
      
      <ErrorBoundary>
        <Suspense fallback={
          <div className="sidebar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner"></div>
          </div>
        }>
          <div className="sidebar">
            <EmployeeList 
              employees={data} 
              onTeamFilter={setSelectedTeam}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading organization chart...</p>
            </div>
          </div>
        }>
          <div className="main-content">
            <OrganizationalChart data={filteredData} setData={setData} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Wrap AppContent with Providers
function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <SelectedEmployeeProvider>
          <AppContent />
        </SelectedEmployeeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App
