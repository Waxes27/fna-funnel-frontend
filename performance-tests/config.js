export const environments = {
  local: {
    frontendUrl: __ENV.FRONTEND_URL || 'http://localhost:8081',
    apiUrl: __ENV.API_URL || 'http://localhost:8080/api/v1',
  },
  staging: {
    frontendUrl: __ENV.FRONTEND_URL || 'https://staging.fna-funnel.com',
    apiUrl: __ENV.API_URL || 'https://api-staging.fna-funnel.com/api/v1',
  }
};

export const getEnv = () => {
  const env = __ENV.TEST_ENV || 'local';
  return environments[env];
};

export const loadProfile = {
  // Baseline load test profile
  stages: [
    { duration: '10s', target: 5 },  // Ramp up to 5 users
    { duration: '30s', target: 5 },  // Stay at 5 users
    { duration: '10s', target: 0 },  // Ramp down to 0 users
  ],
};

export const thresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests must complete below 500ms
  http_req_failed: ['rate<0.05'],                 // Error rate must be less than 5%
  // We can add specific thresholds for our groups
  'group_duration{group:::Frontend Static Assets Load}': ['p(95)<1000'],
  'group_duration{group:::API: Funnel Step Submission}': ['p(95)<800'],
};
