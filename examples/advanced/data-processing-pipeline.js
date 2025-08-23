/**
 * Advanced example: Data Processing Pipeline
 * 
 * This example demonstrates how to build a data processing pipeline
 * using multiple utilities from the library.
 * 
 * Run with: node data-processing-pipeline.js
 */
const { 
  ArrayUtils, 
  ObjectUtils, 
  DateUtils, 
  StringUtils, 
  ValidationUtils 
} = require('@brmorillo/utils');

// Sample data: sales records
const rawSalesData = [
  { date: '2023-01-15', product: 'Laptop', category: 'Electronics', amount: '999.99', customer: { id: '001', name: 'John Doe' } },
  { date: '2023-01-15', product: 'Phone', category: 'Electronics', amount: '699.99', customer: { id: '002', name: 'Jane Smith' } },
  { date: '2023-01-16', product: 'Book', category: 'Books', amount: '15.99', customer: { id: '001', name: 'John Doe' } },
  { date: '2023-01-16', product: 'Laptop', category: 'Electronics', amount: '999.99', customer: { id: '003', name: 'Bob Johnson' } },
  { date: '2023-01-17', product: 'Notebook', category: 'Books', amount: '5.99', customer: { id: '002', name: 'Jane Smith' } },
  { date: '2023-01-17', product: 'Phone', category: 'Electronics', amount: '699.99', customer: { id: '004', name: 'Alice Brown' } },
  { date: 'invalid-date', product: 'Invalid', category: 'Unknown', amount: 'NaN', customer: { id: '005', name: 'Invalid User' } }
];

console.log('Starting data processing pipeline...');
console.log('Raw data:', JSON.stringify(rawSalesData, null, 2));
console.log('---');

// Step 1: Validate and clean the data
console.log('Step 1: Validate and clean the data');
const validSalesData = rawSalesData.filter(sale => {
  // Validate date
  const isValidDate = ValidationUtils.isDate({ value: sale.date });
  
  // Validate amount
  const isValidAmount = ValidationUtils.isNumeric({ value: sale.amount });
  
  // Validate required fields
  const hasRequiredFields = 
    ValidationUtils.isNotEmpty({ value: sale.product }) &&
    ValidationUtils.isNotEmpty({ value: sale.category }) &&
    ValidationUtils.isNotEmpty({ value: sale.customer?.id });
  
  return isValidDate && isValidAmount && hasRequiredFields;
});

console.log(`Filtered ${rawSalesData.length - validSalesData.length} invalid records`);
console.log('Valid data:', JSON.stringify(validSalesData, null, 2));
console.log('---');

// Step 2: Transform the data
console.log('Step 2: Transform the data');
const transformedSalesData = validSalesData.map(sale => {
  // Parse date
  const saleDate = DateUtils.fromISO(sale.date);
  
  // Convert amount to number
  const amount = parseFloat(sale.amount);
  
  // Format product name
  const product = StringUtils.capitalize({ value: sale.product });
  
  // Extract customer ID
  const customerId = sale.customer.id;
  
  return {
    date: saleDate,
    product,
    category: sale.category,
    amount,
    customerId
  };
});

console.log('Transformed data:', JSON.stringify(transformedSalesData, null, 2));
console.log('---');

// Step 3: Group by date
console.log('Step 3: Group by date');
const salesByDate = ArrayUtils.groupBy({
  array: transformedSalesData,
  keyFn: sale => DateUtils.format({ date: sale.date, format: 'yyyy-MM-dd' })
});

console.log('Sales by date:', JSON.stringify(salesByDate, null, 2));
console.log('---');

// Step 4: Calculate daily totals
console.log('Step 4: Calculate daily totals');
const dailyTotals = Object.entries(salesByDate).map(([date, sales]) => {
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  return { date, total };
});

console.log('Daily totals:', JSON.stringify(dailyTotals, null, 2));
console.log('---');

// Step 5: Sort daily totals by amount (highest to lowest)
console.log('Step 5: Sort daily totals by amount');
const sortedDailyTotals = ArrayUtils.sort({
  array: dailyTotals,
  orderBy: { total: 'desc' }
});

console.log('Sorted daily totals:', JSON.stringify(sortedDailyTotals, null, 2));
console.log('---');

// Step 6: Group by category and calculate category totals
console.log('Step 6: Group by category and calculate category totals');
const salesByCategory = ArrayUtils.groupBy({
  array: transformedSalesData,
  keyFn: sale => sale.category
});

const categoryTotals = Object.entries(salesByCategory).map(([category, sales]) => {
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  return { category, total };
});

console.log('Category totals:', JSON.stringify(categoryTotals, null, 2));
console.log('---');

// Step 7: Find top customers
console.log('Step 7: Find top customers');
const salesByCustomer = ArrayUtils.groupBy({
  array: transformedSalesData,
  keyFn: sale => sale.customerId
});

const customerTotals = Object.entries(salesByCustomer).map(([customerId, sales]) => {
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  return { customerId, total };
});

const topCustomers = ArrayUtils.sort({
  array: customerTotals,
  orderBy: { total: 'desc' }
});

console.log('Top customers:', JSON.stringify(topCustomers, null, 2));
console.log('---');

// Step 8: Generate summary report
console.log('Step 8: Generate summary report');
const totalSales = transformedSalesData.reduce((sum, sale) => sum + sale.amount, 0);
const uniqueProducts = ArrayUtils.removeDuplicates({
  array: transformedSalesData.map(sale => sale.product)
});
const uniqueCustomers = ArrayUtils.removeDuplicates({
  array: transformedSalesData.map(sale => sale.customerId)
});

const summaryReport = {
  period: {
    start: DateUtils.format({ date: transformedSalesData[0].date, format: 'yyyy-MM-dd' }),
    end: DateUtils.format({ 
      date: transformedSalesData[transformedSalesData.length - 1].date, 
      format: 'yyyy-MM-dd' 
    })
  },
  totalSales,
  totalOrders: transformedSalesData.length,
  uniqueProducts: uniqueProducts.length,
  uniqueCustomers: uniqueCustomers.length,
  topSellingCategory: categoryTotals[0].category,
  bestDay: sortedDailyTotals[0].date
};

console.log('Summary report:', JSON.stringify(summaryReport, null, 2));