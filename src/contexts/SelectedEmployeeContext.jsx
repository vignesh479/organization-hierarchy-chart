import React, { createContext, useContext, useState } from 'react';

// Create the context
const SelectedEmployeeContext = createContext(undefined);

// Provider component
export function SelectedEmployeeProvider({ children }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const value = {
    selectedEmployeeId,
    setSelectedEmployeeId,
    clearSelection: () => setSelectedEmployeeId(null),
  };

  return (
    <SelectedEmployeeContext.Provider value={value}>
      {children}
    </SelectedEmployeeContext.Provider>
  );
}

// Custom hook to use the context
export function useSelectedEmployee() {
  const context = useContext(SelectedEmployeeContext);
  
  if (context === undefined) {
    throw new Error('useSelectedEmployee must be used within a SelectedEmployeeProvider');
  }
  
  return context;
}

