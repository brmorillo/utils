import { Queue, Stack, MultiQueue } from '../../src/services/queue.service';

/**
 * Testes de benchmark para as estruturas de dados de fila.
 * Estes testes verificam o desempenho das classes em operações de alta frequência.
 */
describe('Queue Service - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('Queue - Operações em massa', () => {
    it('deve processar 1.000.000 de operações de enqueue em tempo razoável', () => {
      const queue = new Queue<number>();
      const count = 1000000;
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.enqueue(i);
        }
      });
      
      console.log(
        `Tempo para enfileirar ${count} itens: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
      expect(queue.size()).toBe(count);
    });

    it('deve processar 100.000 operações de dequeue em tempo razoável', () => {
      const queue = new Queue<number>();
      const count = 100000;
      
      // Preenche a fila primeiro
      for (let i = 0; i < count; i++) {
        queue.enqueue(i);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.dequeue();
        }
      });
      
      console.log(
        `Tempo para desenfileirar ${count} itens: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('Stack - Operações em massa', () => {
    it('deve processar 1.000.000 de operações de push em tempo razoável', () => {
      const stack = new Stack<number>();
      const count = 1000000;
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.push(i);
        }
      });
      
      console.log(
        `Tempo para empilhar ${count} itens: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
      expect(stack.size()).toBe(count);
    });

    it('deve processar 100.000 operações de pop em tempo razoável', () => {
      const stack = new Stack<number>();
      const count = 100000;
      
      // Preenche a pilha primeiro
      for (let i = 0; i < count; i++) {
        stack.push(i);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.pop();
        }
      });
      
      console.log(
        `Tempo para desempilhar ${count} itens: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe('MultiQueue - Operações em massa', () => {
    it('deve processar 500.000 operações de enqueue em múltiplos canais em tempo razoável', () => {
      const multiQueue = new MultiQueue<number>();
      const count = 500000;
      const channels = ['high', 'medium', 'low'];
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const channel = channels[i % channels.length];
          multiQueue.enqueue(i, channel);
        }
      });
      
      console.log(
        `Tempo para enfileirar ${count} itens em ${channels.length} canais: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.002ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.002);
      
      // Verifica se os itens foram distribuídos corretamente
      const totalItems = channels.reduce((sum, channel) => sum + multiQueue.size(channel), 0);
      expect(totalItems).toBe(count);
    });

    it('deve processar 100.000 operações de dequeue em múltiplos canais em tempo razoável', () => {
      const multiQueue = new MultiQueue<number>();
      const count = 100000;
      const channels = ['high', 'medium', 'low'];
      
      // Preenche a fila primeiro
      for (let i = 0; i < count; i++) {
        const channel = channels[i % channels.length];
        multiQueue.enqueue(i, channel);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count / channels.length; i++) {
          for (const channel of channels) {
            multiQueue.dequeue(channel);
          }
        }
      });
      
      console.log(
        `Tempo para desenfileirar ${count} itens de ${channels.length} canais: ${executionTime.toFixed(2)}ms`,
      );
      
      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
      
      // Verifica se todos os canais estão vazios
      for (const channel of channels) {
        expect(multiQueue.isEmpty(channel)).toBe(true);
      }
    });
  });

  describe('Comparação de desempenho', () => {
    it('deve comparar o desempenho entre diferentes estruturas de dados', () => {
      const count = 100000;
      const results: Record<string, number> = {};
      
      // Teste Queue enqueue
      const queue = new Queue<number>();
      results.queueEnqueue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.enqueue(i);
        }
      });
      
      // Teste Stack push
      const stack = new Stack<number>();
      results.stackPush = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.push(i);
        }
      });
      
      // Teste MultiQueue enqueue
      const multiQueue = new MultiQueue<number>();
      results.multiQueueEnqueue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          multiQueue.enqueue(i, i % 2 === 0 ? 'even' : 'odd');
        }
      });
      
      // Teste Queue dequeue
      results.queueDequeue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.dequeue();
        }
      });
      
      // Teste Stack pop
      results.stackPop = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.pop();
        }
      });
      
      // Exibe os resultados
      console.log('Comparação de desempenho para diferentes estruturas:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(6)}ms por operação)`,
        );
      });
      
      // Não fazemos asserções específicas aqui, pois o objetivo é apenas coletar dados para análise
    });
  });
});