import { HashUtils } from '../../src/services/hash.service';

/**
 * Testes de benchmark para a classe HashUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('HashUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('bcryptHash em massa', () => {
    it('deve gerar 100 hashes bcrypt em tempo razoável', () => {
      const count = 100; // bcrypt é intencionalmente lento, então usamos um número menor
      const value = 'senha123';
      const saltRounds = 8; // Menor número de rounds para o benchmark
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.bcryptHash({ value, saltRounds }));
        }
      });

      console.log(
        `Tempo para gerar ${count} hashes bcrypt: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os hashes são diferentes
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // O tempo médio por hash deve ser razoável (bcrypt é lento por design)
      const avgTimePerHash = executionTime / count;
      console.log(
        `Tempo médio por hash bcrypt: ${avgTimePerHash.toFixed(2)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(100); // Menos de 100ms por hash
    });
  });

  describe('bcryptCompare em massa', () => {
    it('deve comparar 1.000 hashes bcrypt em tempo razoável', () => {
      const count = 1000;
      const value = 'senha123';

      // Gera um hash para comparar repetidamente
      const hash = HashUtils.bcryptHash({ value, saltRounds: 8 });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.bcryptCompare({ value, encryptedValue: hash });
        }
      });

      console.log(
        `Tempo para comparar ${count} hashes bcrypt: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por comparação deve ser razoável
      const avgTimePerComparison = executionTime / count;
      console.log(
        `Tempo médio por comparação bcrypt: ${avgTimePerComparison.toFixed(2)}ms`,
      );
      expect(avgTimePerComparison).toBeLessThan(10); // Menos de 10ms por comparação
    });
  });

  describe('sha256Hash em massa', () => {
    it('deve gerar 10.000 hashes SHA-256 em tempo razoável', () => {
      const count = 10000;
      const value = 'texto para hash';
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.sha256Hash(value + i));
        }
      });

      console.log(
        `Tempo para gerar ${count} hashes SHA-256: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os hashes são diferentes
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // O tempo médio por hash deve ser muito rápido
      const avgTimePerHash = executionTime / count;
      console.log(
        `Tempo médio por hash SHA-256: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.1); // Menos de 0.1ms por hash
    });
  });

  describe('sha256HashJson em massa', () => {
    it('deve gerar 10.000 hashes SHA-256 de objetos JSON em tempo razoável', () => {
      const count = 10000;
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const json = { id: i, value: `valor-${i}` };
          hashes.push(HashUtils.sha256HashJson(json));
        }
      });

      console.log(
        `Tempo para gerar ${count} hashes SHA-256 de JSON: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os hashes são diferentes
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // O tempo médio por hash deve ser rápido
      const avgTimePerHash = executionTime / count;
      console.log(
        `Tempo médio por hash SHA-256 de JSON: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.2); // Menos de 0.2ms por hash
    });
  });

  describe('sha256GenerateToken em massa', () => {
    it('deve gerar 10.000 tokens SHA-256 em tempo razoável', () => {
      const count = 10000;
      const tokens: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(HashUtils.sha256GenerateToken());
        }
      });

      console.log(
        `Tempo para gerar ${count} tokens SHA-256: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os tokens são diferentes
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);

      // O tempo médio por token deve ser rápido
      const avgTimePerToken = executionTime / count;
      console.log(
        `Tempo médio por token SHA-256: ${avgTimePerToken.toFixed(3)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(0.2); // Menos de 0.2ms por token
    });
  });

  describe('sha512Hash em massa', () => {
    it('deve gerar 10.000 hashes SHA-512 em tempo razoável', () => {
      const count = 10000;
      const value = 'texto para hash';
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.sha512Hash(value + i));
        }
      });

      console.log(
        `Tempo para gerar ${count} hashes SHA-512: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os hashes são diferentes
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // O tempo médio por hash deve ser rápido
      const avgTimePerHash = executionTime / count;
      console.log(
        `Tempo médio por hash SHA-512: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.1); // Menos de 0.1ms por hash
    });
  });

  describe('sha512HashJson em massa', () => {
    it('deve gerar 10.000 hashes SHA-512 de objetos JSON em tempo razoável', () => {
      const count = 10000;
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const json = { id: i, value: `valor-${i}` };
          hashes.push(HashUtils.sha512HashJson(json));
        }
      });

      console.log(
        `Tempo para gerar ${count} hashes SHA-512 de JSON: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os hashes são diferentes
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // O tempo médio por hash deve ser rápido
      const avgTimePerHash = executionTime / count;
      console.log(
        `Tempo médio por hash SHA-512 de JSON: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.2); // Menos de 0.2ms por hash
    });
  });

  describe('sha512GenerateToken em massa', () => {
    it('deve gerar 10.000 tokens SHA-512 em tempo razoável', () => {
      const count = 10000;
      const tokens: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(HashUtils.sha512GenerateToken());
        }
      });

      console.log(
        `Tempo para gerar ${count} tokens SHA-512: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se todos os tokens são diferentes
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);

      // O tempo médio por token deve ser rápido
      const avgTimePerToken = executionTime / count;
      console.log(
        `Tempo médio por token SHA-512: ${avgTimePerToken.toFixed(3)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(0.2); // Menos de 0.2ms por token
    });
  });

  describe('Comparação de desempenho entre algoritmos', () => {
    it('deve comparar o desempenho entre SHA-256 e SHA-512', () => {
      const count = 5000;
      const value = 'texto para comparação de desempenho';

      // Mede o tempo para SHA-256
      const sha256Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha256Hash(value + i);
        }
      });

      // Mede o tempo para SHA-512
      const sha512Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha512Hash(value + i);
        }
      });

      console.log(
        `Tempo para ${count} hashes SHA-256: ${sha256Time.toFixed(2)}ms`,
      );
      console.log(
        `Tempo para ${count} hashes SHA-512: ${sha512Time.toFixed(2)}ms`,
      );
      console.log(
        `Proporção SHA-512/SHA-256: ${(sha512Time / sha256Time).toFixed(2)}x`,
      );

      // SHA-512 deve ser um pouco mais lento que SHA-256
      expect(sha512Time).toBeGreaterThan(sha256Time * 0.8);
    });

    it('deve comparar o desempenho entre bcrypt e SHA', () => {
      const count = 100; // Número menor para bcrypt
      const value = 'texto para comparação de desempenho';

      // Mede o tempo para bcrypt
      const bcryptTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.bcryptHash({ value: value + i, saltRounds: 8 });
        }
      });

      // Mede o tempo para SHA-256
      const shaTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha256Hash(value + i);
        }
      });

      console.log(
        `Tempo para ${count} hashes bcrypt: ${bcryptTime.toFixed(2)}ms`,
      );
      console.log(
        `Tempo para ${count} hashes SHA-256: ${shaTime.toFixed(2)}ms`,
      );
      console.log(
        `bcrypt é aproximadamente ${(bcryptTime / shaTime).toFixed(2)}x mais lento que SHA-256`,
      );

      // bcrypt deve ser significativamente mais lento que SHA-256 (por design)
      expect(bcryptTime).toBeGreaterThan(shaTime * 10);
    });
  });
});
