export function seedEmployees(server) {
  const employees = [
    // Executive Level
    { 
      id: "1", 
      employeeId: "EMP001",
      name: "Alice Johnson", 
      designation: "CEO", 
      managerId: null,
      email: "alice.johnson@company.com",
      profilePic: "https://i.pravatar.cc/150?img=1",
      team: "Executive"
    },
    { 
      id: "2", 
      employeeId: "EMP002",
      name: "Bob Smith", 
      designation: "CTO", 
      managerId: "1",
      email: "bob.smith@company.com",
      profilePic: "https://i.pravatar.cc/150?img=12",
      team: "Executive"
    },
    { 
      id: "3", 
      employeeId: "EMP003",
      name: "Carol Williams", 
      designation: "CFO", 
      managerId: "1",
      email: "carol.williams@company.com",
      profilePic: "https://i.pravatar.cc/150?img=5",
      team: "Executive"
    },

    // Engineering Department (under CTO)
    { 
      id: "5", 
      employeeId: "EMP005",
      name: "Emma Davis", 
      designation: "VP Engineering", 
      managerId: "2",
      email: "emma.davis@company.com",
      profilePic: "https://i.pravatar.cc/150?img=9",
      team: "Engineering"
    },
    { 
      id: "12", 
      employeeId: "EMP012",
      name: "Liam Jackson", 
      designation: "Senior Backend Dev", 
      managerId: "5",
      email: "liam.jackson@company.com",
      profilePic: "https://i.pravatar.cc/150?img=18",
      team: "Engineering"
    },
    { 
      id: "6", 
      employeeId: "EMP006",
      name: "Frank Miller", 
      designation: "Director of DevOps", 
      managerId: "2",
      email: "frank.miller@company.com",
      profilePic: "https://i.pravatar.cc/150?img=14",
      team: "Engineering"
    },

    // Frontend Team (under VP Engineering)
    { 
      id: "7", 
      employeeId: "EMP007",
      name: "Grace Wilson", 
      designation: "Frontend Team Lead", 
      managerId: "5",
      email: "grace.wilson@company.com",
      profilePic: "https://i.pravatar.cc/150?img=10",
      team: "Engineering"
    },
    { 
      id: "9", 
      employeeId: "EMP009",
      name: "Ivy Taylor", 
      designation: "Frontend Developer", 
      managerId: "7",
      email: "ivy.taylor@company.com",
      profilePic: "https://i.pravatar.cc/150?img=16",
      team: "Engineering"
    },

    // DevOps Team (under Director of DevOps)
    { 
      id: "15", 
      employeeId: "EMP015",
      name: "Olivia Martin", 
      designation: "Senior DevOps Engineer", 
      managerId: "6",
      email: "olivia.martin@company.com",
      profilePic: "https://i.pravatar.cc/150?img=24",
      team: "Engineering"
    },

    // Finance Department (under CFO)
    { 
      id: "18", 
      employeeId: "EMP018",
      name: "Ruby Martinez", 
      designation: "Controller", 
      managerId: "3",
      email: "ruby.martinez@company.com",
      profilePic: "https://i.pravatar.cc/150?img=27",
      team: "Finance"
    },
    { 
      id: "19", 
      employeeId: "EMP019",
      name: "Sam Robinson", 
      designation: "Senior Accountant", 
      managerId: "18",
      email: "sam.robinson@company.com",
      profilePic: "https://i.pravatar.cc/150?img=26",
      team: "Finance"
    },
    { 
      id: "20", 
      employeeId: "EMP020",
      name: "Tina Clark", 
      designation: "Financial Analyst", 
      managerId: "18",
      email: "tina.clark@company.com",
      profilePic: "https://i.pravatar.cc/150?img=28",
      team: "Finance"
    }

  ];

  employees.forEach((e) => server.create("employee", e));
}