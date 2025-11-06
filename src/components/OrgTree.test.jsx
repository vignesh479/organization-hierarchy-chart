import React from 'react';
import { renderWithDnd } from '../test-utils/test-utils';
import OrgTree from './OrgTree';
import { mockEmployees, buildByManagerMap, buildDirectMenteesMap, getTopManagers } from '../test-utils/mockData';

// Mock react-organizational-chart components
jest.mock('react-organizational-chart', () => ({
  Tree: ({ children, label }) => (
    <div data-testid="tree-component">
      <div data-testid="tree-label">{label}</div>
      <div data-testid="tree-children">{children}</div>
    </div>
  ),
  TreeNode: ({ children, label }) => (
    <div data-testid="tree-node">
      <div data-testid="tree-node-label">{label}</div>
      <div data-testid="tree-node-children">{children}</div>
    </div>
  ),
}));

// Mock OrgNode component
jest.mock('./OrgNode', () => {
  return function MockOrgNode({ employee, onDrop, directMentees }) {
    return (
      <div data-testid={`org-node-${employee.id}`} data-employee-name={employee.name}>
        <span>{employee.name}</span>
        <span data-testid={`mentees-count-${employee.id}`}>
          {directMentees.map(e => <span key={e.id}>{e.name}</span>)}
        </span>
      </div>
    );
  };
});

describe('OrgTree', () => {
  const mockOnDrop = jest.fn();

  beforeEach(() => {
    mockOnDrop.mockClear();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const byManager = buildByManagerMap(mockEmployees);
      const directMenteesMap = buildDirectMenteesMap(mockEmployees);
      const topManagers = getTopManagers(mockEmployees);

      const { container } = renderWithDnd(
        <OrgTree 
          byManager={byManager}
          directMenteesMap={directMenteesMap}
          topManagers={topManagers}
          onDrop={mockOnDrop}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should render all employees in the hierarchy', () => {
      const byManager = buildByManagerMap(mockEmployees);
      const directMenteesMap = buildDirectMenteesMap(mockEmployees);
      const topManagers = getTopManagers(mockEmployees);

      const { getByText } = renderWithDnd(
        <OrgTree 
          byManager={byManager}
          directMenteesMap={directMenteesMap}
          topManagers={topManagers}
          onDrop={mockOnDrop}
        />
      );

      mockEmployees.forEach(employee => {
        expect(getByText(employee.name)).toBeInTheDocument();
      });
    });
  });

  describe('Hierarchical Structure', () => {
    it('should pass correct employee data to OrgNode', () => {
      const byManager = buildByManagerMap(mockEmployees);
      const directMenteesMap = buildDirectMenteesMap(mockEmployees);
      const topManagers = getTopManagers(mockEmployees);

      const { getByTestId } = renderWithDnd(
        <OrgTree 
          byManager={byManager}
          directMenteesMap={directMenteesMap}
          topManagers={topManagers}
          onDrop={mockOnDrop}
        />
      );

      mockEmployees.forEach(employee => {
        const orgNode = getByTestId(`org-node-${employee.id}`);
        expect(orgNode).toHaveAttribute('data-employee-name', employee.name);
      });
    });
  });

  describe('Empty and Edge Cases', () => {

    it('should handle single employee with no reports', () => {
      const singleEmployee = [mockEmployees[0]];
      const byManager = buildByManagerMap(singleEmployee);
      const directMenteesMap = buildDirectMenteesMap(singleEmployee);
      const topManagers = getTopManagers(singleEmployee);

      const { getByText, getByTestId } = renderWithDnd(
        <OrgTree 
          byManager={byManager}
          directMenteesMap={directMenteesMap}
          topManagers={topManagers}
          onDrop={mockOnDrop}
        />
      );

      expect(getByText(singleEmployee[0].name)).toBeInTheDocument();
      expect(getByTestId('mentees-count-1').children).toHaveLength(0);
    });
  });
});


