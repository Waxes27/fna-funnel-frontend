import { options as baseOptions } from '../load-test.js';
import loadTest, { setup as baseSetup, handleSummary as baseHandleSummary } from '../load-test.js';

// Override the stages for a stress test
export const options = Object.assign({}, baseOptions, {
  stages: [
    { duration: '1m', target: 20 },   // Ramp up to 20 users
    { duration: '2m', target: 20 },   // Stay at 20 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
});

export const setup = baseSetup;
export const handleSummary = baseHandleSummary;
export default loadTest;
