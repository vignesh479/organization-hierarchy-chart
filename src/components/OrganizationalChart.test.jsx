import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithDnd } from '../test-utils/test-utils';
import OrganizationalChart from './OrganizationalChart';
import { mockEmployees, mockFetchSuccess, mockFetchError } from '../test-utils/mockData';

// Mock the OrgTree component to simplify testing
jest.mock('./OrgTree', () => {
  return function MockOrgTree({ byManager, topManagers, onDrop }) {
    // Get actual employee objects from byManager
    const getAllEmployees = (map) => {
      const employees = [];
      for (const empList of map.values()) {
        if (empList) employees.push(...empList);
      }
      return employees;
    };
    
    const allEmployees = getAllEmployees(byManager);
    const employee4 = allEmployees.find(e => e.id === '4');
    const employee2 = allEmployees.find(e => e.id === '2');
    
    return (
      <div data-testid="org-tree">
        <div data-testid="by-manager-size">{byManager.size}</div>
        <div data-testid="top-managers-count">{topManagers.length}</div>
        <button 
          data-testid="trigger-drop"
          onClick={() => employee4 && employee2 && onDrop(employee4, employee2)}
        >
          Trigger Drop
        </button>
      </div>
    );
  };
});

describe('OrganizationalChart', () => {
  const mockSetData = jest.fn();

  beforeEach(() => {
    mockSetData.mockClear();
    global.fetch.mockClear();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderWithDnd(
        <OrganizationalChart data={mockEmployees} setData={mockSetData} />
      );
      expect(container).toBeInTheDocument();
      expect(container.querySelector('[data-testid="org-tree"]')).toBeInTheDocument();
    });

    it('should render with empty data array', () => {
      const { getByTestId } = renderWithDnd(
        <OrganizationalChart data={[]} setData={mockSetData} />
      );
      expect(getByTestId('org-tree')).toBeInTheDocument();
      expect(getByTestId('top-managers-count')).toHaveTextContent('0');
    });
  });

  describe('Drag and Drop - handleDrop', () => {
    it('should make API call with correct parameters on drop', async () => {
      mockFetchSuccess(mockEmployees);

      const { getByTestId } = renderWithDnd(
        <OrganizationalChart data={mockEmployees} setData={mockSetData} />
      );
      
      const triggerButton = getByTestId('trigger-drop');
      triggerButton.click();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/employees/4/move',
          expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ managerId: '2' }),
          })
        );
      });
    });
  });
});


