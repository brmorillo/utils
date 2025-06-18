/**
 * Este é um exemplo de como implementar uma fila usando Redis com a interface IQueue.
 * Observe que este é apenas um exemplo e requer a biblioteca 'redis' instalada.
 * 
 * Para instalar: npm install redis
 */

import { createClient } from 'redis';
import { IQueue } from '../src/services/queue.service';

/**
 * Implementação de uma fila usando Redis.
 * @template T O tipo de elementos armazenados na fila.
 */
export class RedisQueue<T> implements IQueue<T> {
  private client;
  private queueKey: string;

  /**
   * Cria uma nova instância de RedisQueue.
   * @param queueKey A chave usada para identificar a fila no Redis.
   * @param redisUrl A URL de conexão do Redis (opcional).
   */
  constructor(queueKey: string, redisUrl: string = 'redis://localhost:6379') {
    this.queueKey = queueKey;
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  /**
   * Adiciona um elemento ao final da fila.
   * @param item O item a ser enfileirado.
   * @returns O tamanho atualizado da fila.
   */
  async enqueue(item: T): Promise<number> {
    const serializedItem = JSON.stringify(item);
    await this.client.rPush(this.queueKey, serializedItem);
    return this.size();
  }

  /**
   * Remove e retorna o elemento no início da fila.
   * @returns O item desenfileirado ou undefined se a fila estiver vazia.
   */
  async dequeue(): Promise<T | undefined> {
    const item = await this.client.lPop(this.queueKey);
    if (!item) return undefined;
    return JSON.parse(item);
  }

  /**
   * Retorna o elemento no início da fila sem removê-lo.
   * @returns O item no início ou undefined se a fila estiver vazia.
   */
  async peek(): Promise<T | undefined> {
    const items = await this.client.lRange(this.queueKey, 0, 0);
    if (!items || items.length === 0) return undefined;
    return JSON.parse(items[0]);
  }

  /**
   * Retorna o tamanho atual da fila.
   * @returns O número de elementos na fila.
   */
  async size(): Promise<number> {
    return await this.client.lLen(this.queueKey);
  }

  /**
   * Verifica se a fila está vazia.
   * @returns True se a fila estiver vazia, false caso contrário.
   */
  async isEmpty(): Promise<boolean> {
    const size = await this.size();
    return size === 0;
  }

  /**
   * Limpa todos os elementos da fila.
   */
  async clear(): Promise<void> {
    await this.client.del(this.queueKey);
  }

  /**
   * Retorna todos os elementos da fila sem removê-los.
   * @returns Um array contendo todos os elementos da fila.
   */
  async toArray(): Promise<T[]> {
    const items = await this.client.lRange(this.queueKey, 0, -1);
    return items.map(item => JSON.parse(item));
  }

  /**
   * Fecha a conexão com o Redis.
   */
  async close(): Promise<void> {
    await this.client.quit();
  }
}

/**
 * Exemplo de uso da RedisQueue
 */
async function redisQueueExample() {
  // Cria uma fila Redis para armazenar mensagens
  const messageQueue = new RedisQueue<{ id: number; text: string }>('message_queue');

  try {
    // Limpa a fila para começar com uma fila vazia
    await messageQueue.clear();
    console.log('Fila limpa.');

    // Adiciona algumas mensagens à fila
    await messageQueue.enqueue({ id: 1, text: 'Primeira mensagem' });
    await messageQueue.enqueue({ id: 2, text: 'Segunda mensagem' });
    await messageQueue.enqueue({ id: 3, text: 'Terceira mensagem' });
    
    // Verifica o tamanho da fila
    const size = await messageQueue.size();
    console.log(`Tamanho da fila: ${size}`);

    // Verifica a primeira mensagem sem removê-la
    const firstMessage = await messageQueue.peek();
    console.log('Primeira mensagem na fila:', firstMessage);

    // Processa todas as mensagens na fila
    console.log('Processando mensagens:');
    while (!await messageQueue.isEmpty()) {
      const message = await messageQueue.dequeue();
      console.log(`- Processando mensagem ${message?.id}: ${message?.text}`);
    }

    // Verifica se a fila está vazia
    const isEmpty = await messageQueue.isEmpty();
    console.log(`A fila está vazia? ${isEmpty}`);

  } catch (error) {
    console.error('Erro ao usar a fila Redis:', error);
  } finally {
    // Fecha a conexão com o Redis
    await messageQueue.close();
  }
}

// Executa o exemplo (descomente para testar)
// redisQueueExample().catch(console.error);

/**
 * Exemplo de implementação de uma fila de prioridade usando Redis
 */
export class RedisPriorityQueue<T> {
  private client;
  private queueKey: string;

  /**
   * Cria uma nova instância de RedisPriorityQueue.
   * @param queueKey A chave usada para identificar a fila no Redis.
   * @param redisUrl A URL de conexão do Redis (opcional).
   */
  constructor(queueKey: string, redisUrl: string = 'redis://localhost:6379') {
    this.queueKey = queueKey;
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  /**
   * Adiciona um elemento à fila com uma prioridade específica.
   * Prioridades menores são processadas primeiro.
   * @param item O item a ser enfileirado.
   * @param priority A prioridade do item (menor = maior prioridade).
   */
  async enqueue(item: T, priority: number): Promise<void> {
    const serializedItem = JSON.stringify(item);
    await this.client.zAdd(this.queueKey, [{ score: priority, value: serializedItem }]);
  }

  /**
   * Remove e retorna o elemento com a maior prioridade (menor score).
   * @returns O item desenfileirado ou undefined se a fila estiver vazia.
   */
  async dequeue(): Promise<T | undefined> {
    // Obtém o item com a maior prioridade (menor score)
    const items = await this.client.zRangeWithScores(this.queueKey, 0, 0);
    if (!items || items.length === 0) return undefined;
    
    // Remove o item da fila
    await this.client.zRem(this.queueKey, items[0].value);
    
    return JSON.parse(items[0].value);
  }

  /**
   * Retorna o tamanho atual da fila.
   * @returns O número de elementos na fila.
   */
  async size(): Promise<number> {
    return await this.client.zCard(this.queueKey);
  }

  /**
   * Limpa todos os elementos da fila.
   */
  async clear(): Promise<void> {
    await this.client.del(this.queueKey);
  }

  /**
   * Fecha a conexão com o Redis.
   */
  async close(): Promise<void> {
    await this.client.quit();
  }
}

/**
 * Exemplo de uso da RedisPriorityQueue
 */
async function redisPriorityQueueExample() {
  // Cria uma fila de prioridade Redis para tarefas
  const taskQueue = new RedisPriorityQueue<{ id: number; task: string }>('task_priority_queue');

  try {
    // Limpa a fila para começar com uma fila vazia
    await taskQueue.clear();
    console.log('Fila de prioridade limpa.');

    // Adiciona algumas tarefas com diferentes prioridades
    await taskQueue.enqueue({ id: 1, task: 'Tarefa de baixa prioridade' }, 3);
    await taskQueue.enqueue({ id: 2, task: 'Tarefa de alta prioridade' }, 1);
    await taskQueue.enqueue({ id: 3, task: 'Tarefa de média prioridade' }, 2);
    
    // Verifica o tamanho da fila
    const size = await taskQueue.size();
    console.log(`Tamanho da fila de prioridade: ${size}`);

    // Processa todas as tarefas na ordem de prioridade
    console.log('Processando tarefas por prioridade:');
    while (await taskQueue.size() > 0) {
      const task = await taskQueue.dequeue();
      console.log(`- Processando tarefa ${task?.id}: ${task?.task}`);
    }

  } catch (error) {
    console.error('Erro ao usar a fila de prioridade Redis:', error);
  } finally {
    // Fecha a conexão com o Redis
    await taskQueue.close();
  }
}

// Executa o exemplo (descomente para testar)
// redisPriorityQueueExample().catch(console.error);