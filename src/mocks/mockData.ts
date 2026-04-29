export const mockUsers = [
  {
    id: 'user-client-1',
    email: 'client@example.com',
    password: 'password123',
    role: 'CLIENT',
    firstName: 'John',
    lastName: 'Doe',
    mobile: '0821234567'
  },
  {
    id: 'user-adviser-1',
    email: 'adviser@example.com',
    password: 'password123',
    role: 'ADVISER',
    firstName: 'Jane',
    lastName: 'Smith',
    mobile: '0831234567'
  },
  {
    id: 'user-admin-1',
    email: 'admin@example.com',
    password: 'password123',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'System',
    mobile: '0841234567'
  }
];

export const mockProfiles = [
  {
    id: 'profile-1',
    userId: 'user-client-1',
    dob: '1985-06-15',
    idNumber: '8506155009087',
    maritalStatus: 'Married',
    dependants: 2,
    employmentStatus: 'Employed',
    occupation: 'Software Engineer',
    employer: 'Tech Corp',
    annualIncome: 600000
  }
];

export const mockFinancialData = [
  {
    id: 'fin-data-1',
    profileId: 'profile-1',
    monthlyIncome: 50000,
    monthlyExpenses: 35000,
    assets: [
      { id: 'a1', type: 'property', name: 'Primary Residence', value: 2500000 },
      { id: 'a2', type: 'savings', name: 'Emergency Fund', value: 100000 },
      { id: 'a3', type: 'investments', name: 'Unit Trusts', value: 300000 }
    ],
    liabilities: [
      { id: 'l1', type: 'mortgage', name: 'Home Loan', value: 1800000, monthlyRepayment: 18000 },
      { id: 'l2', type: 'vehicle', name: 'Car Finance', value: 250000, monthlyRepayment: 5000 },
      { id: 'l3', type: 'credit_card', name: 'Credit Card', value: 15000, monthlyRepayment: 1500 }
    ]
  }
];
