import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SelectedEmployeeProvider } from '../contexts/SelectedEmployeeContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Custom render function that includes all necessary providers
export function renderWithProviders(
  ui,
  {
    initialEntries = ['/'],
    withDnd = false,
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    let content = children;
    
    // Wrap with DnD provider if needed
    if (withDnd) {
      content = <DndProvider backend={HTML5Backend}>{content}</DndProvider>;
    }
    
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <NotificationProvider>
          <SelectedEmployeeProvider>
            {content}
          </SelectedEmployeeProvider>
        </NotificationProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Render with DnD provider
export function renderWithDnd(ui, options = {}) {
  return renderWithProviders(ui, { ...options, withDnd: true });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';


