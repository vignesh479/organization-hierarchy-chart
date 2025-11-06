// Mock employee data for testing organizational chart
export const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    designation: 'CEO',
    team: 'Executive',
    managerId: null,
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    designation: 'CTO',
    team: 'Engineering',
    managerId: '1',
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    designation: 'Engineering Manager',
    team: 'Engineering',
    managerId: '2',
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    designation: 'Senior Engineer',
    team: 'Engineering',
    managerId: '3',
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    designation: 'CFO',
    team: 'Finance',
    managerId: '1',
    profilePic: 'https://via.placeholder.com/150',
  },
];

// Helper function to build byManager map
export function buildByManagerMap(employees) {
  const map = new Map();
  for (const e of employees) {
    if (!map.has(e.managerId)) map.set(e.managerId, []);
    map.get(e.managerId).push(e);
  }
  return map;
}

// Helper function to build directMentees map
export function buildDirectMenteesMap(employees) {
  const map = new Map();
  for (const e of employees) {
    if (!map.has(e.managerId)) map.set(e.managerId, []);
    map.get(e.managerId).push(e.id);
  }
  return map;
}

// Mock fetch responses
export const mockFetchSuccess = (data) => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

export const mockFetchError = (error = 'Network error') => {
  global.fetch.mockRejectedValueOnce(new Error(error));
};

// Get top level managers (no manager)
export function getTopManagers(employees) {
  return employees.filter(emp => emp.managerId === null);
}

// Get direct reports for an employee
export function getDirectReports(employees, managerId) {
  return employees.filter(emp => emp.managerId === managerId);
}


