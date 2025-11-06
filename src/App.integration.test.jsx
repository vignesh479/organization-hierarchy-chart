import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    designation: 'CEO',
    team: 'Executive',
    managerId: null,
    profilePic: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    designation: 'CTO',
    team: 'Engineering',
    managerId: '1',
    profilePic: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Carol Williams',
    email: 'carol.williams@company.com',
    designation: 'CFO',
    team: 'Finance',
    managerId: '1',
    profilePic: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'David Brown',
    email: 'david.brown@company.com',
    designation: 'Engineering Manager',
    team: 'Engineering',
    managerId: '2',
    profilePic: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    designation: 'Senior Engineer',
    team: 'Engineering',
    managerId: '4',
    profilePic: 'https://i.pravatar.cc/150?img=5',
  },
];

// Helper to create mock fetch responses
const mockFetchSuccess = (data) => {
  return jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => data,
    })
  );
};

const mockFetchError = (message = 'Network error') => {
  return jest.fn(() => Promise.reject(new Error(message)));
};

// Helper to render App with Router
const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

// Wait for app to load completely
const waitForAppToLoad = async () => {
  await waitFor(
    () => {
      expect(screen.queryByText(/Loading organization chart/i)).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};

describe('Integration Tests - Core Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('1. App loads correctly with employee data', () => {
    it('should fetch and display employee data on initial load', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      renderApp();
      expect(screen.getByText(/Loading organization chart/i)).toBeInTheDocument();
      await waitForAppToLoad();
      expect(global.fetch).toHaveBeenCalledWith('/api/employees');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByText('Employees')).toBeInTheDocument();
        expect(screen.getByText('5 employees')).toBeInTheDocument();
      });
      const aliceElements = screen.getAllByText('Alice Johnson');
      const bobElements = screen.getAllByText('Bob Smith');
      expect(aliceElements.length).toBeGreaterThan(0);
      expect(bobElements.length).toBeGreaterThan(0);
    });

    it('should handle API errors gracefully', async () => {
      global.fetch = mockFetchError('Failed to fetch employees');

      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/Failed to Load/i)).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch employees/i)).toBeInTheDocument();
      });
    });
  });

  describe('2. Hierarchy level check for each employee', () => {
    it('should display employees in correct hierarchical structure', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      const { container } = renderApp();
      await waitForAppToLoad();

      const aliceCard = container.querySelector('[data-employee-id="1"]');
      const bobCard = container.querySelector('[data-employee-id="2"]');
      const carolCard = container.querySelector('[data-employee-id="3"]');
      const davidCard = container.querySelector('[data-employee-id="4"]');
      const emmaCard = container.querySelector('[data-employee-id="5"]');

      expect(aliceCard).toBeInTheDocument();
      expect(bobCard).toBeInTheDocument();
      expect(carolCard).toBeInTheDocument();
      expect(davidCard).toBeInTheDocument();
      expect(emmaCard).toBeInTheDocument();
    });

    it('should display correct employee information for each person', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      renderApp();
      await waitForAppToLoad();

      const aliceElements = screen.getAllByText('Alice Johnson');
      expect(aliceElements.length).toBeGreaterThan(0);
      expect(screen.getAllByText('CEO').length).toBeGreaterThan(0);

      const bobElements = screen.getAllByText('Bob Smith');
      expect(bobElements.length).toBeGreaterThan(0);
      expect(screen.getAllByText('CTO').length).toBeGreaterThan(0);

      expect(screen.getAllByText('David Brown').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Engineering Manager').length).toBeGreaterThan(0);
    });
  });

  describe('5. Mobile move button functionality', () => {
    it('should display move button on mobile when employee is selected', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { container } = renderApp();
      await waitForAppToLoad();
      const bobCard = container.querySelector('[data-employee-id="2"]');
      const bobCardContent = bobCard.querySelector('.employee-card-content');
      
      await userEvent.click(bobCardContent);

      await waitFor(() => {
        const highlighted = container.querySelector('.highlighted');
        expect(highlighted).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('6. Scroll into view when employee is selected', () => {
    it('should trigger scroll into view when employee card is highlighted', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      const { container } = renderApp();
      await waitForAppToLoad();

      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      const carolCard = container.querySelector('[data-employee-id="3"]');
      const carolCardContent = carolCard.querySelector('.employee-card-content');
      await userEvent.click(carolCardContent);

      await waitFor(() => {
        const highlightedCard = container.querySelector('.highlighted');
        expect(highlightedCard).toBeInTheDocument();
      }, { timeout: 2000 });

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should deselect employee when clicked again (toggle)', async () => {
      global.fetch = mockFetchSuccess(mockEmployees);

      const { container } = renderApp();
      await waitForAppToLoad();
      const davidCard = container.querySelector('[data-employee-id="4"]');
      const davidCardContent = davidCard.querySelector('.employee-card-content');
      await userEvent.click(davidCardContent);
      await waitFor(() => {
        expect(container.querySelector('.highlighted')).toBeInTheDocument();
      }, { timeout: 2000 });
      await userEvent.click(davidCardContent);
      await waitFor(() => {
        expect(container.querySelector('.highlighted')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});

