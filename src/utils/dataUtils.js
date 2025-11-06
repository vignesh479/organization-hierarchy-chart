// Builds map with managerId as key and array of direct reportees.
export function buildEmployeeMaps(employees) {
  const byManager = new Map();
  const directMenteesMap = new Map();
  
  // Build both maps in a single pass - more efficient!
  for (const employee of employees) {
    const managerId = employee.managerId;
    
    // Initialize both maps if managerId doesn't exist
    if (!byManager.has(managerId)) {
      byManager.set(managerId, []);
      directMenteesMap.set(managerId, []);
    }
    
    // Add to both maps
    byManager.get(managerId).push(employee);
    directMenteesMap.get(managerId).push(employee.id);
  }
  
  return { byManager, directMenteesMap };
}


