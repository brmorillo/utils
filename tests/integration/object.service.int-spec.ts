import { ObjectUtils } from '../../src/services/object.service';

/**
 * Testes de integração para a classe ObjectUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('ObjectUtils - Testes de Integração', () => {
  describe('Operações encadeadas', () => {
    it('deve processar corretamente uma sequência de operações em objetos', () => {
      // Cenário: Processar configurações de usuário
      // 1. Configuração inicial do usuário
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

      // 1. Simular armazenamento comprimido
      const compressed = ObjectUtils.compressObjectToBase64({
        json: userConfig,
        urlSafe: true,
      });

      // 2. Simular recuperação do armazenamento
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
      });

      // 3. Extrair apenas as configurações de layout
      const layoutConfig = ObjectUtils.pick({
        obj: decompressed as any,
        keys: ['layout'],
      });

      // 4. Modificar as configurações de layout
      const newLayout = ObjectUtils.deepMerge({
        target: layoutConfig,
        source: { layout: { toolbar: 'bottom' } },
      });

      // 5. Mesclar de volta com a configuração completa
      const updatedConfig = ObjectUtils.deepMerge({
        target: decompressed as any,
        source: newLayout,
      });

      // Verificações
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

    it('deve processar dados de formulário com validação e normalização', () => {
      // Cenário: Processar dados de formulário do usuário
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

      // 1. Extrair apenas os dados pessoais
      const personalData = ObjectUtils.pick({
        obj: formData,
        keys: ['name', 'email', 'age'],
      });

      // 2. Achatar as preferências para processamento
      const flatPreferences = ObjectUtils.flattenObject({
        obj: { preferences: formData.preferences },
      });

      // 3. Normalizar as preferências para valores booleanos
      const normalizedPreferences = {
        'preferences.newsletter':
          flatPreferences['preferences.newsletter'] === 'yes',
        'preferences.marketing':
          flatPreferences['preferences.marketing'] === 'yes',
      };

      // 4. Desachatar as preferências normalizadas
      const processedPreferences = {};
      Object.keys(normalizedPreferences).forEach(key => {
        ObjectUtils.unflattenObject({
          obj: processedPreferences,
          path: key,
          value:
            normalizedPreferences[key as keyof typeof normalizedPreferences],
        });
      });

      // 5. Mesclar tudo em um objeto final processado
      const processedFormData = ObjectUtils.deepMerge({
        target: {
          ...personalData,
          age: parseInt(personalData.age, 10),
          address: formData.address,
        },
        source: processedPreferences,
      });

      // Verificações
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

  describe('Operações encadeadas', () => {
    it('deve suportar operações encadeadas de transformação de objetos', () => {
      // Objeto inicial
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

      // 1. Clone o objeto para não modificar o original
      const cloned = ObjectUtils.deepClone({ obj: data });

      // 2. Extraia apenas os produtos
      const productsOnly = ObjectUtils.pick({
        obj: cloned,
        keys: ['products'],
      });

      // 3. Agrupe os produtos por categoria
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

      // 4. Crie um objeto com estatísticas por categoria
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

      // 5. Mescle as estatísticas com os filtros originais
      const result = ObjectUtils.deepMerge({
        target: { filters: data.filters },
        source: categoryStats,
      });

      // Verificações
      expect(result.stats.electronics.count).toBe(2);
      expect(result.stats.books.count).toBe(1);
      expect(result.filters.categories).toEqual(['electronics', 'books']);
      expect(result.stats.electronics.totalPrice).toBeCloseTo(16.98);
      expect(result.stats.electronics.avgPrice).toBeCloseTo(8.49);
    });

    it('deve processar transformações complexas de objetos', () => {
      // Objeto inicial: dados de uma loja online
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

      // 1. Achatar o inventário para facilitar o processamento
      const flatInventory = ObjectUtils.flattenObject({
        obj: storeData.inventory,
      });

      // 2. Criar um mapa de todos os produtos
      const allProducts = [] as any[];
      Object.keys(flatInventory).forEach(key => {
        if (Array.isArray(flatInventory[key])) {
          allProducts.push(...flatInventory[key]);
        }
      });

      // 3. Calcular o valor total do inventário
      const totalInventoryValue = allProducts.reduce(
        (sum, product) => sum + product.price * product.stock,
        0,
      );

      // 4. Agrupar produtos por faixa de preço
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

      // 5. Criar um relatório
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

      // 6. Comprimir o relatório para armazenamento
      const compressedReport = ObjectUtils.compressObject({ json: report });

      // 7. Descomprimir para verificação
      const decompressedReport = ObjectUtils.decompressObject({
        jsonString: compressedReport,
      });

      // Verificações
      expect(decompressedReport).toEqual(report);
      expect(report.totalProducts).toBe(7);
      expect(report.lowStockProducts).toContain('p2');
      expect(report.productsByPriceRange.high).toBe(4);
    });
  });
});