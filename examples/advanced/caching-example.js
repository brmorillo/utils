/**
 * Advanced example: Caching for Performance Optimization
 * 
 * This example demonstrates how to use the Cache utility to improve performance
 * for expensive operations.
 * 
 * Run with: node caching-example.js
 */
const { Utils, Cache } = require('@brmorillo/utils');

// Initialize utils
const utils = Utils.getInstance();
const http = utils.getHttpService();

// Create a cache for API responses
const apiCache = new Cache(60000); // 60 seconds TTL

// Simulated expensive calculation
function calculateFibonacci(n) {
  console.log(`Calculating Fibonacci(${n})...`);
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

// Cached version of the expensive calculation
async function getCachedFibonacci(n) {
  const key = `fibonacci-${n}`;
  return apiCache.getOrCompute(key, async () => {
    return calculateFibonacci(n);
  });
}

// Simulated API call
async function fetchUserData(userId) {
  console.log(`Fetching data for user ${userId} from API...`);
  // In a real app, this would be an actual API call
  // return http.get(`/users/${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    lastLogin: new Date().toISOString()
  };
}

// Cached version of the API call
async function getCachedUserData(userId) {
  const key = `user-${userId}`;
  return apiCache.getOrCompute(key, async () => {
    return fetchUserData(userId);
  });
}

// Example usage
async function runExample() {
  console.log('Starting caching example...');
  
  // Example 1: Caching expensive calculations
  console.log('\nExample 1: Caching expensive calculations');
  console.log('First call (not cached):');
  const fib1 = await getCachedFibonacci(10);
  console.log(`Result: ${fib1}`);
  
  console.log('\nSecond call (cached):');
  const fib2 = await getCachedFibonacci(10);
  console.log(`Result: ${fib2}`);
  
  // Example 2: Caching API responses
  console.log('\nExample 2: Caching API responses');
  console.log('First call for user 123 (not cached):');
  const user1 = await getCachedUserData('123');
  console.log('User data:', user1);
  
  console.log('\nSecond call for user 123 (cached):');
  const user2 = await getCachedUserData('123');
  console.log('User data:', user2);
  
  console.log('\nCall for different user 456 (not cached):');
  const user3 = await getCachedUserData('456');
  console.log('User data:', user3);
  
  // Example 3: Cache management
  console.log('\nExample 3: Cache management');
  console.log(`Cache size: ${apiCache.size}`);
  
  console.log('Deleting user-123 from cache...');
  apiCache.delete('user-123');
  
  console.log('Fetching user 123 again (should hit API):');
  const user4 = await getCachedUserData('123');
  console.log('User data:', user4);
  
  // Example 4: Cache expiration
  console.log('\nExample 4: Cache expiration');
  // Create a cache with 2 second TTL
  const shortCache = new Cache(2000);
  
  console.log('Adding item to short cache...');
  shortCache.set('short-lived', { value: 'This will expire soon' });
  
  console.log('Immediate get:', shortCache.get('short-lived'));
  
  console.log('Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('After 3 seconds:', shortCache.get('short-lived'));
  
  // Example 5: Cache pruning
  console.log('\nExample 5: Cache pruning');
  const pruneCache = new Cache(1000); // 1 second TTL
  
  for (let i = 0; i < 5; i++) {
    pruneCache.set(`item-${i}`, { index: i });
  }
  
  console.log(`Cache size before waiting: ${pruneCache.size}`);
  
  console.log('Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const prunedCount = pruneCache.prune();
  console.log(`Pruned ${prunedCount} items`);
  console.log(`Cache size after pruning: ${pruneCache.size}`);
}

// Run the example
runExample().catch(console.error);