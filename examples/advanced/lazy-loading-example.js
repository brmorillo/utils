/**
 * Advanced example: Lazy Loading for Performance Optimization
 * 
 * This example demonstrates how to use the LazyLoader utility to improve performance
 * by only loading expensive dependencies when needed.
 * 
 * Run with: node lazy-loading-example.js
 */
const { LazyLoader } = require('@brmorillo/utils');

// Simulate expensive modules
class ExpensiveModule {
  constructor(name) {
    console.log(`Loading expensive module: ${name}`);
    // Simulate expensive initialization
    const startTime = Date.now();
    while (Date.now() - startTime < 500) {
      // Busy wait to simulate expensive initialization
    }
    this.name = name;
  }
  
  process(data) {
    console.log(`Processing data with ${this.name}: ${data}`);
    return `Processed: ${data}`;
  }
}

// Create lazy loaders for expensive modules
const moduleALoader = new LazyLoader(() => new ExpensiveModule('Module A'));
const moduleBLoader = new LazyLoader(() => new ExpensiveModule('Module B'));
const moduleCLoader = new LazyLoader(() => new ExpensiveModule('Module C'));

// Application that uses the modules
class Application {
  constructor() {
    console.log('Application initialized');
    // Note: No expensive modules are loaded yet
  }
  
  featureA(data) {
    console.log('Running Feature A');
    // Module A is only loaded when Feature A is used
    const moduleA = moduleALoader.get();
    return moduleA.process(data);
  }
  
  featureB(data) {
    console.log('Running Feature B');
    // Module B is only loaded when Feature B is used
    const moduleB = moduleBLoader.get();
    return moduleB.process(data);
  }
  
  featureC(data) {
    console.log('Running Feature C');
    // Module C is only loaded when Feature C is used
    const moduleC = moduleCLoader.get();
    return moduleC.process(data);
  }
  
  // This feature uses multiple modules
  combinedFeature(data) {
    console.log('Running Combined Feature');
    const moduleA = moduleALoader.get(); // Already loaded, no initialization cost
    const moduleC = moduleCLoader.get(); // Already loaded, no initialization cost
    
    const resultA = moduleA.process(`${data}-part1`);
    const resultC = moduleC.process(`${data}-part2`);
    
    return `Combined: ${resultA} and ${resultC}`;
  }
}

// Example usage
async function runExample() {
  console.log('Starting lazy loading example...');
  
  // Create application (no expensive modules loaded yet)
  console.log('\nInitializing application:');
  const app = new Application();
  
  // Use Feature A (loads Module A)
  console.log('\nUsing Feature A:');
  const resultA = app.featureA('test data');
  console.log(`Result: ${resultA}`);
  
  // Use Feature C (loads Module C)
  console.log('\nUsing Feature C:');
  const resultC = app.featureC('more data');
  console.log(`Result: ${resultC}`);
  
  // Use Combined Feature (reuses already loaded modules)
  console.log('\nUsing Combined Feature:');
  const combinedResult = app.combinedFeature('combined data');
  console.log(`Result: ${combinedResult}`);
  
  // Feature B is never used, so Module B is never loaded
  console.log('\nModule B was never loaded because Feature B was not used');
  
  // Check which modules are loaded
  console.log('\nChecking loaded modules:');
  console.log(`Module A loaded: ${moduleALoader.isLoaded()}`);
  console.log(`Module B loaded: ${moduleBLoader.isLoaded()}`);
  console.log(`Module C loaded: ${moduleCLoader.isLoaded()}`);
  
  // Async lazy loading example
  console.log('\nAsync lazy loading example:');
  
  // Define async factory function
  const asyncFactory = async () => {
    console.log('Starting async initialization...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Async initialization complete');
    return new ExpensiveModule('Async Module');
  };
  
  console.log('Before async loading');
  const asyncModule = await LazyLoader.getAsync(asyncFactory);
  console.log('After async loading');
  
  const asyncResult = asyncModule.process('async data');
  console.log(`Async result: ${asyncResult}`);
}

// Run the example
runExample().catch(console.error);