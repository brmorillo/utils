import { ObjectUtils } from '../../src/services/object.service';

/**
 * Integration tests for the ObjectUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('ObjectUtils - Integration Tests', () => {
  describe('Chained operations', () => {
    it('should correctly process a sequence of operations on objects', () => {
      // Scenario: Process user settings
      // 1. Initial user configuration
      const userConfig = {
        theme: 'dark',
        fontSize: 14,
        layout: {
          sidebar: true,
          toolbar: 'top',
          panels: ['explorer', 'search', 'debug'],
        },
        extensions: {
          enabled: ['typescript', 'eslint', 'prettier'],
          disabled: ['php'],
        },
      };

      // 1. Simulate compressed storage
      const compressed = ObjectUtils.compressObjectToBase64({
        json: userConfig,
        urlSafe: true,
      });

      // 2. Simulate retrieval from storage
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
      });

      // 3. Extract only the layout settings
      const layoutConfig = ObjectUtils.pick({
        obj: decompressed as any,
        keys: ['layout'],
      });

      // 4. Modify the layout settings
      const newLayout = ObjectUtils.deepMerge({
        target: layoutConfig,
        source: { layout: { toolbar: 'bottom' } },
      });

      // 5. Merge back with the full configuration
      const updatedConfig = ObjectUtils.deepMerge({
        target: decompressed as any,
        source: newLayout,
      });

      // Assertions
      expect(updatedConfig).toEqual({
        theme: 'dark',
        fontSize: 14,
        layout: {
          sidebar: true,
          toolbar: 'bottom',
          panels: ['explorer', 'search', 'debug'],
        },
        extensions: {
          enabled: ['typescript', 'eslint', 'prettier'],
          disabled: ['php'],
        },
      });
    });

    it('should process form data with validation and normalization', () => {
      // Scenario: Process user form data
      const formData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: '30',
        address: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
        },
        preferences: {
          newsletter: 'yes',
          marketing: 'no',
        },
      };

      // 1. Extract only the personal data
      const personalData = ObjectUtils.pick({
        obj: formData,
        keys: ['name', 'email', 'age'],
      });

      // 2. Flatten the preferences for processing
      const flatPreferences = ObjectUtils.flattenObject({
        obj: { preferences: formData.preferences },
      });

      // 3. Normalize the preferences to boolean values
      const normalizedPreferences = {
        'preferences.newsletter':
          flatPreferences['preferences.newsletter'] === 'yes',
        'preferences.marketing':
          flatPreferences['preferences.marketing'] === 'yes',
      };

      // 4. Unflatten the normalized preferences
      const processedPreferences = {};
      Object.keys(normalizedPreferences).forEach(key => {
        ObjectUtils.unflattenObject({
          obj: processedPreferences,
          path: key,
          value:
            normalizedPreferences[key as keyof typeof normalizedPreferences],
        });
      });

      // 5. Merge everything into a final processed object
      const processedFormData = ObjectUtils.deepMerge({
        target: {
          ...personalData,
          age: parseInt(personalData.age, 10),
          address: formData.address,
        },
        source: processedPreferences,
      });

      // Assertions
      expect(processedFormData).toEqual({
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
        },
        preferences: {
          newsletter: true,
          marketing: false,
        },
      });
    });
  });

  describe('Chained operations', () => {
    it('should support chained object transformation operations', () => {
      // Initial object
      const data = {
        products: [
          { id: 1, name: 'Product A', price: 10.99, category: 'electronics' },
          { id: 2, name: 'Product B', price: 24.99, category: 'books' },
          { id: 3, name: 'Product C', price: 5.99, category: 'electronics' },
        ],
        filters: {
          minPrice: 0,
          maxPrice: 50,
          categories: ['electronics', 'books'],
        },
      };

      // 1. Clone the object to avoid modifying the original
      const cloned = ObjectUtils.deepClone({ obj: data });

      // 2. Extract only the products
      const productsOnly = ObjectUtils.pick({
        obj: cloned,
        keys: ['products'],
      });

      // 3. Group the products by category
      const productsByCategory = ObjectUtils.groupBy({
        obj: productsOnly.products.reduce(
          (acc, product) => {
            acc[product.id.toString()] = product;
            return acc;
          },
          {} as Record<string, any>,
        ),
        callback: product => product.category,
      });

      // 4. Create an object with statistics by category
      const categoryStats = {} as Record<string, any>;
      Object.keys(productsByCategory).forEach(category => {
        const productIds = productsByCategory[category];
        const products = productIds.map(id => {
          const product = productsOnly.products.find(p => p.id.toString() === id);
          return product || { price: 0 };
        });

        const totalPrice = products.reduce(
          (sum, product) => sum + product.price,
          0,
        );
        const avgPrice = totalPrice / products.length;

        ObjectUtils.unflattenObject({
          obj: categoryStats,
          path: `stats.${category}`,
          value: {
            count: products.length,
            totalPrice,
            avgPrice,
          },
        });
      });

      // 5. Merge the statistics with the original filters
      const result = ObjectUtils.deepMerge({
        target: { filters: data.filters },
        source: categoryStats,
      });

      // Assertions
      expect(result.stats.electronics.count).toBe(2);
      expect(result.stats.books.count).toBe(1);
      expect(result.filters.categories).toEqual(['electronics', 'books']);
      expect(result.stats.electronics.totalPrice).toBeCloseTo(16.98);
      expect(result.stats.electronics.avgPrice).toBeCloseTo(8.49);
    });

    it('should process complex object transformations', () => {
      // Initial object: data for an online store
      const storeData = {
        inventory: {
          electronics: {
            smartphones: [
              { id: 'p1', name: 'Phone X', price: 999.99, stock: 10 },
              { id: 'p2', name: 'Phone Y', price: 599.99, stock: 5 },
            ],
            laptops: [
              { id: 'l1', name: 'Laptop A', price: 1299.99, stock: 8 },
              { id: 'l2', name: 'Laptop B', price: 899.99, stock: 12 },
            ],
          },
          books: {
            fiction: [
              { id: 'b1', name: 'Novel 1', price: 19.99, stock: 50 },
              { id: 'b2', name: 'Novel 2', price: 15.99, stock: 30 },
            ],
            nonfiction: [
              { id: 'b3', name: 'Guide 1', price: 29.99, stock: 20 },
            ],
          },
        },
        sales: {
          '2023-01': {
            electronics: 15000,
            books: 5000,
          },
          '2023-02': {
            electronics: 18000,
            books: 6000,
          },
        },
      };

      // 1. Flatten the inventory to make processing easier
      const flatInventory = ObjectUtils.flattenObject({
        obj: storeData.inventory,
      });

      // 2. Create a map of all products
      const allProducts = [] as any[];
      Object.keys(flatInventory).forEach(key => {
        if (Array.isArray(flatInventory[key])) {
          allProducts.push(...flatInventory[key]);
        }
      });

      // 3. Calculate the total inventory value
      const totalInventoryValue = allProducts.reduce(
        (sum, product) => sum + product.price * product.stock,
        0,
      );

      // 4. Group products by price range
      const productsByPriceRange = allProducts.reduce(
        (acc, product) => {
          let range;
          if (product.price < 50) range = 'low';
          else if (product.price < 500) range = 'medium';
          else range = 'high';

          if (!acc[range]) acc[range] = [];
          acc[range].push(product);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      // 5. Create a report
      const report = {
        totalProducts: allProducts.length,
        totalInventoryValue,
        productsByPriceRange: {
          low: productsByPriceRange.low?.length || 0,
          medium: productsByPriceRange.medium?.length || 0,
          high: productsByPriceRange.high?.length || 0,
        },
        lowStockProducts: allProducts.filter(p => p.stock < 10).map(p => p.id),
      };

      // 6. Compress the report for storage
      const compressedReport = ObjectUtils.compressObject({ json: report });

      // 7. Decompress for verification
      const decompressedReport = ObjectUtils.decompressObject({
        jsonString: compressedReport,
      });

      // Assertions
      expect(decompressedReport).toEqual(report);
      expect(report.totalProducts).toBe(7);
      expect(report.lowStockProducts).toContain('p2');
      expect(report.productsByPriceRange.high).toBe(4);
    });
  });
});