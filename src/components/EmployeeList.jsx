import React, { useState, useMemo, useEffect } from 'react';
import { useSelectedEmployee } from '../contexts/SelectedEmployeeContext';
import { useDebounce } from '../hooks/useDebounce';
import './EmployeeList.css';
import EmployeeListItem from './EmployeeListItem';

function EmployeeList({ employees, onTeamFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search by 300ms
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedEmployeeId, setSelectedEmployeeId } = useSelectedEmployee();

  // Auto-collapse on mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setIsCollapsed(true);
      }
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get unique teams
  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(employees.map(emp => emp.team))];
    return ['All', ...uniqueTeams.sort()];
  }, [employees]);

  // Filter employees based on search and team selection
  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (selectedTeam !== 'All') {
      filtered = filtered.filter(emp => emp.team === selectedTeam);
    }
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query) ||
        emp.team.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeId.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [employees, debouncedSearchQuery, selectedTeam]);

  // Auto-collapse when employee is selected or filters are applied
  useEffect(() => {
    if (selectedEmployeeId || selectedTeam !== 'All') {
      setIsCollapsed(true);
    }
  }, [selectedEmployeeId, selectedTeam]);

  // Handle team selection change
  const handleTeamChange = (team) => {
    setSelectedTeam(team);
    onTeamFilter(team === 'All' ? null : team);
  };

  // Handle employee click (toggle if clicking the same employee)
  const handleEmployeeClick = (employeeId) => {
    if (selectedEmployeeId === employeeId) {
      setSelectedEmployeeId(null);
    } else {
      setSelectedEmployeeId(employeeId);
    }
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`employee-list-container ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle-btn" 
        onClick={toggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {!isCollapsed && (
        <>
          <div className="employee-list-header">
            <h2>Employees</h2>
            <div className="employee-count">{filteredEmployees.length} employees</div>
          </div>

          {/* Search Box */}
          <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, role, team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="clear-search"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Team Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="team-filter">Filter by Team:</label>
        <select
          id="team-filter"
          value={selectedTeam}
          onChange={(e) => handleTeamChange(e.target.value)}
          className="team-filter-select"
        >
          {teams.map(team => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
        </>
      )}

      {/* Employee List */}
      <div className="employee-list-items">
        {filteredEmployees.length === 0 ? (
          <div className="no-results">No employees found</div>
        ) : (
          filteredEmployees.map(employee => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployeeId === employee.id}
              onClick={() => handleEmployeeClick(employee.id)}
              isCollapsed={isCollapsed}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default React.memo(EmployeeList);

