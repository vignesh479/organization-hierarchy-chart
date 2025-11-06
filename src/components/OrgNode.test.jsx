import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithDnd } from '../test-utils/test-utils';
import OrgNode from './OrgNode';
import { mockEmployees } from '../test-utils/mockData';
import { SelectedEmployeeProvider } from '../contexts/SelectedEmployeeContext';

describe('OrgNode', () => {
  const mockEmployee = mockEmployees[0];
  const mockOnDrop = jest.fn();
  const directMentees = ['2', '5']; // IDs of direct reports

  beforeEach(() => {
    mockOnDrop.mockClear();
    Element.prototype.scrollIntoView.mockClear();
  });

  const renderOrgNode = (props = {}) => {
    return renderWithDnd(
      <OrgNode
        employee={mockEmployee}
        onDrop={mockOnDrop}
        directMentees={directMentees}
        {...props}
      />
    );
  };

  describe('Rendering', () => {
    it('should render employee information', () => {
      const { getByText, getByAltText } = renderOrgNode();

      expect(getByText(mockEmployee.name)).toBeInTheDocument();
      expect(getByText(mockEmployee.email)).toBeInTheDocument();
      expect(getByText(mockEmployee.designation)).toBeInTheDocument();
      expect(getByAltText(mockEmployee.name)).toBeInTheDocument();
    });

    it('should render employee profile picture', () => {
      const { getByAltText } = renderOrgNode();
      const img = getByAltText(mockEmployee.name);
      
      expect(img).toHaveAttribute('src', mockEmployee.profilePic);
    });
  });

  describe('Selection Functionality', () => {
    it('should not be highlighted initially', () => {
      const { container } = renderOrgNode();
      const content = container.querySelector('.employee-card-content');
      
      expect(content).not.toHaveClass('highlighted');
    });

    it('should apply highlighted class when employee is selected', async () => {
      // Render with context that has this employee selected
      const { container, getByText } = renderWithDnd(
        <SelectedEmployeeProvider>
          <OrgNode
            employee={mockEmployee}
            onDrop={mockOnDrop}
            directMentees={directMentees}
          />
        </SelectedEmployeeProvider>
      );

      const card = getByText(mockEmployee.name).closest('.employee-card-content');
      
      // Initially not highlighted
      expect(card).not.toHaveClass('highlighted');
      const user = userEvent.setup();
      await user.click(card);

      // After clicking, should be selected
      await waitFor(() => {
        expect(card).toHaveClass('highlighted');
      });
    });

    it('should deselect when clicked again', async () => {
      const user = userEvent.setup();
      const { container } = renderOrgNode();

      const cardContent = container.querySelector('.employee-card-content');
      
      // First click - select
      await user.click(cardContent);
      await waitFor(() => {
        expect(cardContent).toHaveClass('highlighted');
      });

      // Second click - deselect
      await user.click(cardContent);
      await waitFor(() => {
        expect(cardContent).not.toHaveClass('highlighted');
      });
    });

    it('should scroll into view when selected', async () => {
      const user = userEvent.setup();
      const { container } = renderOrgNode();

      const cardContent = container.querySelector('.employee-card-content');
      await user.click(cardContent);

      await waitFor(() => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      });
    });
  });

  describe('Props Handling', () => {
    it('should handle different employees', () => {
      mockEmployees.slice(0, 3).forEach((employee) => {
        const { getByText, unmount } = renderOrgNode({ employee });
        
        expect(getByText(employee.name)).toBeInTheDocument();
        expect(getByText(employee.email)).toBeInTheDocument();
        expect(getByText(employee.designation)).toBeInTheDocument();
        
        unmount();
      });
    });
  });
});
