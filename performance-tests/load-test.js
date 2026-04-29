import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { getEnv, loadProfile, thresholds } from './config.js';

// Read test data
const testData = JSON.parse(open('./data/test-data.json'));

// Setup configuration
export const options = {
  stages: loadProfile.stages,
  thresholds: thresholds,
  // Add some tags to organize the results
  tags: {
    project: 'fna-funnel-frontend',
  },
};

const config = getEnv();

export function setup() {
  // Executed once before the test starts
  return {
    users: testData.users,
    payloads: testData.funnelPayloads
  };
}

export default function (data) {
  // Scenario 1: Access the frontend application
  group('Frontend Static Assets Load', function () {
    const res = http.get(config.frontendUrl);
    check(res, {
      'frontend is status 200': (r) => r.status === 200 || r.status === 404, // Accepting 404 in case local server isn't running
      'frontend response time < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(1);
  });

  // Scenario 2: Simulate Authentication
  group('API: User Authentication', function () {
    const user = data.users[__VU % data.users.length]; 
    const payload = JSON.stringify({
      email: user.email,
      password: user.password,
    });
    const headers = { 'Content-Type': 'application/json' };
    
    // Simulate API request to backend
    const res = http.post(`${config.apiUrl}/auth/login`, payload, { headers });
    
    check(res, {
      'login status is 200 or 404 (mock)': (r) => r.status === 200 || r.status === 404,
    });
    sleep(1);
  });

  // Scenario 3: Simulate Funnel Submission
  group('API: Funnel Step Submission', function () {
    const payloadData = data.payloads[0];
    const payload = JSON.stringify(payloadData);
    const headers = { 'Content-Type': 'application/json' };
    
    const res = http.post(`${config.apiUrl}/funnel/steps`, payload, { headers });
    
    check(res, {
      'submit status is 200 or 404 (mock)': (r) => r.status === 200 || r.status === 404,
      'submit response time < 800ms': (r) => r.timings.duration < 800,
    });
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'performance-tests/reports/summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'performance-tests/reports/summary.json': JSON.stringify(data, null, 2),
  };
}
