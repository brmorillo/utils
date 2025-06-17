import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Testes de benchmark para a classe JWTUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('JWTUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  const secretKey = 'benchmark-test-secret-key';
  const payload = { userId: '123', role: 'user', data: 'benchmark test payload' };

  describe('Geração de tokens em massa', () => {
    it('deve gerar 1.000 tokens JWT em tempo razoável', () => {
      const count = 1000;
      const tokens: string[] = [];
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(JWTUtils.generate({
            payload: { ...payload, unique: i },
            secretKey,
            options: { expiresIn: '1h' }
          }));
        }
      });
      
      console.log(
        `Tempo para gerar ${count} tokens JWT: ${executionTime.toFixed(2)}ms`,
      );
      
      // Verifica se todos os tokens são diferentes
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);
      
      // O tempo médio por token deve ser menor que 1ms
      const avgTimePerToken = executionTime / count;
      console.log(
        `Tempo médio por token JWT: ${avgTimePerToken.toFixed(2)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(1);
    });
  });

  describe('Verificação de tokens em massa', () => {
    it('deve verificar 1.000 tokens JWT em tempo razoável', () => {
      const count = 1000;
      
      // Gera um token para verificar repetidamente
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.verify({
            token,
            secretKey
          });
        }
      });
      
      console.log(
        `Tempo para verificar ${count} tokens JWT: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por verificação deve ser menor que 1ms
      const avgTimePerVerification = executionTime / count;
      console.log(
        `Tempo médio por verificação de token JWT: ${avgTimePerVerification.toFixed(2)}ms`,
      );
      expect(avgTimePerVerification).toBeLessThan(1);
    });
  });

  describe('Decodificação de tokens em massa', () => {
    it('deve decodificar 10.000 tokens JWT em tempo razoável', () => {
      const count = 10000;
      
      // Gera um token para decodificar repetidamente
      const token = JWTUtils.generate({
        payload,
        secretKey
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.decode({
            token
          });
        }
      });
      
      console.log(
        `Tempo para decodificar ${count} tokens JWT: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por decodificação deve ser menor que 0.1ms
      const avgTimePerDecode = executionTime / count;
      console.log(
        `Tempo médio por decodificação de token JWT: ${avgTimePerDecode.toFixed(2)}ms`,
      );
      expect(avgTimePerDecode).toBeLessThan(0.1);
    });
  });

  describe('Verificação de expiração em massa', () => {
    it('deve verificar a expiração de 10.000 tokens JWT em tempo razoável', () => {
      const count = 10000;
      
      // Gera um token com expiração para verificar repetidamente
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.isExpired({
            token
          });
        }
      });
      
      console.log(
        `Tempo para verificar expiração de ${count} tokens JWT: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por verificação de expiração deve ser menor que 0.1ms
      const avgTimePerCheck = executionTime / count;
      console.log(
        `Tempo médio por verificação de expiração: ${avgTimePerCheck.toFixed(2)}ms`,
      );
      expect(avgTimePerCheck).toBeLessThan(0.1);
    });
  });

  describe('Renovação de tokens em massa', () => {
    it('deve renovar 1.000 tokens JWT em tempo razoável', () => {
      const count = 1000;
      
      // Gera um token para renovar repetidamente
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' }
      });
      
      // Espera o token expirar
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const executionTime = measureExecutionTime(() => {
            for (let i = 0; i < count; i++) {
              JWTUtils.refresh({
                token,
                secretKey,
                options: { expiresIn: '1h' }
              });
            }
          });
          
          console.log(
            `Tempo para renovar ${count} tokens JWT: ${executionTime.toFixed(2)}ms`,
          );
          
          // O tempo médio por renovação deve ser menor que 1ms
          const avgTimePerRefresh = executionTime / count;
          console.log(
            `Tempo médio por renovação de token JWT: ${avgTimePerRefresh.toFixed(2)}ms`,
          );
          expect(avgTimePerRefresh).toBeLessThan(1);
          
          resolve();
        }, 1100); // Espera 1.1 segundos para garantir que o token expirou
      });
    });
  });

  describe('Comparação de algoritmos', () => {
    it('deve comparar o desempenho de diferentes algoritmos de assinatura', () => {
      const count = 100;
      const algorithms = ['HS256', 'HS384', 'HS512'];
      const results: Record<string, number> = {};
      
      for (const algorithm of algorithms) {
        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            JWTUtils.generate({
              payload,
              secretKey,
              options: { 
                algorithm: algorithm as any,
                expiresIn: '1h'
              }
            });
          }
        });
        
        results[algorithm] = executionTime / count;
        console.log(
          `Tempo médio por token com ${algorithm}: ${results[algorithm].toFixed(2)}ms`,
        );
      }
      
      // Verifica se os resultados foram registrados
      expect(Object.keys(results).length).toBe(algorithms.length);
      
      // Todos os algoritmos devem ter desempenho razoável
      for (const algorithm of algorithms) {
        expect(results[algorithm]).toBeLessThan(1);
      }
    });
  });
});