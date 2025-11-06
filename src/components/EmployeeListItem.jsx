import React, { useRef, useEffect } from 'react';
import './EmployeeList.css'; 

// Individual employee list item component with scroll behavior
function EmployeeListItem({ employee, isSelected, onClick, isCollapsed }) {
  const itemRef = useRef(null);

  // Scroll into view when this item becomes selected
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  return (
    <div 
      ref={itemRef}
      className={`employee-list-item ${isSelected ? 'selected' : ''} ${isCollapsed ? 'item-collapsed' : ''}`}
      onClick={onClick}
      title={isCollapsed ? `${employee.name} - ${employee.designation}` : ''}
    >
      <img 
        src={employee.profilePic} 
        alt={employee.name}
        className="employee-list-avatar"
        loading="lazy"
      />
      {!isCollapsed && (
        <div className="employee-list-info">
          <div className="employee-list-name">{employee.name}</div>
          <div className="employee-list-designation">{employee.designation}</div>
          <div className="employee-list-team">
            <span className="team-badge">{employee.team}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(EmployeeListItem);