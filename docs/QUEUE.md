# Serviço de Filas, Pilhas e Estruturas de Dados

Este serviço fornece implementações genéricas para diversas estruturas de dados relacionadas a filas. Estas estruturas podem ser usadas tanto com variáveis locais quanto adaptadas para uso com sistemas externos como Redis.

## Estruturas Disponíveis

### Queue (Fila)

Uma fila é uma estrutura de dados que segue o princípio FIFO (First-In-First-Out), onde o primeiro elemento adicionado é o primeiro a ser removido.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar uma fila vazia
const queue = QueueUtils.createQueue<number>();

// Criar uma fila com valores iniciais
const initialQueue = QueueUtils.createQueue<string>({ initialItems: ['a', 'b', 'c'] });

// Criar uma fila com tamanho máximo
const boundedQueue = QueueUtils.createQueue<number>({ maxSize: 5 });

// Adicionar elementos
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

// Verificar o primeiro elemento sem removê-lo
const first = queue.peek(); // 1

// Remover e obter o primeiro elemento
const removed = queue.dequeue(); // 1

// Verificar o tamanho
const size = queue.size(); // 2

// Verificar se está vazia
const isEmpty = queue.isEmpty(); // false

// Verificar se está cheia (apenas para filas com tamanho máximo)
const isFull = boundedQueue.isFull(); // false

// Obter todos os elementos como array
const allItems = queue.toArray(); // [2, 3]

// Limpar a fila
queue.clear();
```

### Stack (Pilha)

Uma pilha é uma estrutura de dados que segue o princípio LIFO (Last-In-First-Out), onde o último elemento adicionado é o primeiro a ser removido.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar uma pilha vazia
const stack = QueueUtils.createStack<number>();

// Criar uma pilha com valores iniciais
const initialStack = QueueUtils.createStack<string>({ initialItems: ['a', 'b', 'c'] });

// Criar uma pilha com tamanho máximo
const boundedStack = QueueUtils.createStack<number>({ maxSize: 10 });

// Adicionar elementos
stack.push(1);
stack.push(2);
stack.push(3);

// Verificar o elemento do topo sem removê-lo
const top = stack.peek(); // 3

// Remover e obter o elemento do topo
const popped = stack.pop(); // 3

// Verificar o tamanho
const size = stack.size(); // 2

// Verificar se está vazia
const isEmpty = stack.isEmpty(); // false

// Verificar se está cheia (apenas para pilhas com tamanho máximo)
const isFull = boundedStack.isFull(); // false

// Obter todos os elementos como array
const allItems = stack.toArray(); // [1, 2]

// Limpar a pilha
stack.clear();
```

### MultiQueue (Fila de Múltiplas Saídas)

Uma fila de múltiplas saídas permite enfileirar elementos em diferentes canais ou prioridades e processá-los separadamente.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar uma fila múltipla vazia
const multiQueue = QueueUtils.createMultiQueue<number>();

// Criar uma fila múltipla com valores iniciais
const initialMultiQueue = QueueUtils.createMultiQueue<string>({
  initialItems: {
    high: ['urgent1', 'urgent2'],
    low: ['normal1', 'normal2']
  }
});

// Criar uma fila múltipla com tamanhos máximos por canal
const boundedMultiQueue = QueueUtils.createMultiQueue<number>({
  channelMaxSizes: {
    high: 10,
    medium: 20,
    low: 50
  },
  defaultMaxSize: 30 // Tamanho padrão para canais sem limite específico
});

// Adicionar elementos em diferentes canais
multiQueue.enqueue(1, 'high');
multiQueue.enqueue(2, 'medium');
multiQueue.enqueue(3, 'low');

// Verificar o primeiro elemento de um canal sem removê-lo
const firstHigh = multiQueue.peek('high'); // 1

// Remover e obter o primeiro elemento de um canal
const removedHigh = multiQueue.dequeue('high'); // 1

// Verificar o tamanho de um canal
const sizeHigh = multiQueue.size('high'); // 0
const sizeLow = multiQueue.size('low'); // 1

// Verificar se um canal está vazio
const isHighEmpty = multiQueue.isEmpty('high'); // true

// Verificar se um canal está cheio (apenas para filas com tamanho máximo)
const isLowFull = boundedMultiQueue.isFull('low'); // false

// Obter todos os canais disponíveis
const channels = multiQueue.channels(); // ['medium', 'low']

// Obter todos os elementos de um canal como array
const lowItems = multiQueue.toArray('low'); // [3]

// Obter todos os elementos de todos os canais
const allItems = multiQueue.toFullArray(); // { medium: [2], low: [3] }

// Limpar um canal específico
multiQueue.clearChannel('medium');

// Limpar todos os canais
multiQueue.clearAll();
```

### CircularBuffer (Buffer Circular)

Um buffer circular (também conhecido como ring buffer) é uma estrutura de dados de tamanho fixo que funciona como se as extremidades estivessem conectadas. Quando o buffer está cheio, adicionar um novo elemento sobrescreve o elemento mais antigo.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar um buffer circular com capacidade específica
const buffer = QueueUtils.createCircularBuffer<number>({ capacity: 5 });

// Adicionar elementos (retorna false se o buffer estiver cheio)
buffer.add(1); // true
buffer.add(2); // true
buffer.add(3); // true

// Adicionar elemento com sobrescrita (retorna o elemento sobrescrito)
buffer.add(4); // true
buffer.add(5); // true
const overwritten = buffer.addOverwrite(6); // 1 (sobrescreve o elemento mais antigo)

// Verificar o elemento mais antigo sem removê-lo
const oldest = buffer.peek(); // 2

// Remover e obter o elemento mais antigo
const removed = buffer.remove(); // 2

// Verificar o tamanho atual e a capacidade
const size = buffer.getSize(); // 4
const capacity = buffer.getCapacity(); // 5

// Verificar se está vazio ou cheio
const isEmpty = buffer.isEmpty(); // false
const isFull = buffer.isFull(); // false

// Obter todos os elementos como array (na ordem do mais antigo para o mais recente)
const allItems = buffer.toArray(); // [3, 4, 5, 6]

// Limpar o buffer
buffer.clear();
```

### PriorityQueue (Fila de Prioridade)

Uma fila de prioridade é uma estrutura de dados onde cada elemento tem uma prioridade associada. Os elementos com maior prioridade (menor valor numérico) são processados antes dos elementos com menor prioridade.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar uma fila de prioridade vazia
const priorityQueue = QueueUtils.createPriorityQueue<string>();

// Criar uma fila de prioridade com tamanho máximo
const boundedPriorityQueue = QueueUtils.createPriorityQueue<string>({ maxSize: 10 });

// Adicionar elementos com diferentes prioridades (menor número = maior prioridade)
priorityQueue.enqueue('tarefa urgente', 1);
priorityQueue.enqueue('tarefa média', 5);
priorityQueue.enqueue('tarefa baixa', 10);

// Verificar o elemento de maior prioridade sem removê-lo
const highest = priorityQueue.peek(); // 'tarefa urgente'

// Remover e obter o elemento de maior prioridade
const removed = priorityQueue.dequeue(); // 'tarefa urgente'

// Verificar o tamanho
const size = priorityQueue.size(); // 2

// Verificar se está vazia
const isEmpty = priorityQueue.isEmpty(); // false

// Verificar se está cheia (apenas para filas com tamanho máximo)
const isFull = boundedPriorityQueue.isFull(); // false

// Obter todos os elementos como array (ordenados por prioridade)
const allItems = priorityQueue.toArray(); // ['tarefa média', 'tarefa baixa']

// Limpar a fila
priorityQueue.clear();
```

### DelayQueue (Fila com Atraso)

Uma fila com atraso é uma estrutura de dados onde os elementos só ficam disponíveis após um tempo específico. Útil para implementar tarefas agendadas ou operações com atraso.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Criar uma fila com atraso vazia
const delayQueue = QueueUtils.createDelayQueue<string>();

// Criar uma fila com atraso com tamanho máximo
const boundedDelayQueue = QueueUtils.createDelayQueue<string>({ maxSize: 10 });

// Adicionar elementos com diferentes atrasos (em milissegundos)
delayQueue.enqueue('processar em 1 segundo', 1000);
delayQueue.enqueue('processar em 500ms', 500);
delayQueue.enqueue('processar em 2 segundos', 2000);

// Verificar o próximo elemento a ficar disponível sem removê-lo
const next = delayQueue.peek(); // 'processar em 500ms'

// Verificar quanto tempo falta para o próximo elemento ficar disponível
const timeLeft = delayQueue.timeUntilNext(); // tempo em ms

// Remover e obter todos os elementos que já estão disponíveis
const readyItems = delayQueue.dequeueReady(); // elementos prontos

// Verificar o tamanho
const size = delayQueue.size(); // número de elementos restantes

// Verificar se está vazia
const isEmpty = delayQueue.isEmpty(); // false

// Verificar se está cheia (apenas para filas com tamanho máximo)
const isFull = boundedDelayQueue.isFull(); // false

// Obter todos os elementos como array (ordenados por tempo de disponibilidade)
const allItems = delayQueue.toArray(); // todos os elementos na fila

// Limpar a fila
delayQueue.clear();
```

## Filas e Pilhas com Tamanho Máximo

As implementações de `Queue`, `Stack`, `MultiQueue`, `PriorityQueue` e `DelayQueue` suportam a definição de um tamanho máximo, o que é útil para limitar o consumo de memória e implementar padrões como buffer limitado.

```typescript
// Criar uma fila com tamanho máximo de 3 elementos
const boundedQueue = QueueUtils.createQueue<number>({ maxSize: 3 });

// Adicionar elementos até o limite
boundedQueue.enqueue(1); // retorna 1
boundedQueue.enqueue(2); // retorna 2
boundedQueue.enqueue(3); // retorna 3

// Tentar adicionar além do limite
const result = boundedQueue.enqueue(4); // retorna -1 (falha)

// Verificar se a fila está cheia
const isFull = boundedQueue.isFull(); // true

// Remover um elemento para liberar espaço
boundedQueue.dequeue(); // 1

// Agora é possível adicionar mais um elemento
boundedQueue.enqueue(4); // retorna 3
```

## Casos de Uso Comuns

### Gerenciamento de Tarefas por Prioridade

```typescript
const taskQueue = QueueUtils.createPriorityQueue<{ id: number; description: string }>();

// Adicionar tarefas com diferentes prioridades
taskQueue.enqueue({ id: 1, description: "Corrigir bug crítico" }, 1);
taskQueue.enqueue({ id: 2, description: "Implementar nova funcionalidade" }, 5);
taskQueue.enqueue({ id: 3, description: "Atualizar documentação" }, 10);

// Processar tarefas na ordem de prioridade
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  console.log(`Processando tarefa: ${task.description}`);
}
```

### Agendamento de Tarefas

```typescript
const scheduledTasks = QueueUtils.createDelayQueue<() => void>();

// Agendar tarefas para execução futura
scheduledTasks.enqueue(() => console.log("Tarefa executada após 1 segundo"), 1000);
scheduledTasks.enqueue(() => console.log("Tarefa executada após 500ms"), 500);

// Em um loop de processamento
setInterval(() => {
  const readyTasks = scheduledTasks.dequeueReady();
  readyTasks.forEach(task => task());
}, 100);
```

### Histórico Limitado

```typescript
const history = QueueUtils.createCircularBuffer<string>({ capacity: 10 });

// Adicionar eventos ao histórico
history.add("Usuário fez login");
history.add("Usuário acessou a página inicial");
// ... mais eventos

// Quando o buffer estiver cheio, os eventos mais antigos serão automaticamente removidos
history.add("Novo evento"); // Sobrescreve o evento mais antigo se o buffer estiver cheio

// Obter o histórico completo
const allEvents = history.toArray();
```

## Integração com Sistemas Externos

As interfaces `IQueue`, `IStack`, `IMultiQueue`, `IPriorityQueue` e `IDelayQueue` podem ser implementadas para trabalhar com sistemas externos como Redis, MongoDB, ou qualquer outro sistema de armazenamento.

### Exemplo com Redis

Veja o arquivo `examples/redis-queue-example.ts` para um exemplo de como implementar uma fila usando Redis:

```typescript
import { RedisQueue } from '../examples/redis-queue-example';

// Criar uma fila Redis
const redisQueue = new RedisQueue<string>('my-queue');

// Usar a fila de forma assíncrona
async function processQueue() {
  await redisQueue.enqueue('item1');
  await redisQueue.enqueue('item2');
  
  const item = await redisQueue.dequeue();
  console.log(item); // 'item1'
  
  await redisQueue.clear();
}
```

## Benchmark

O serviço inclui testes de benchmark para avaliar o desempenho das diferentes estruturas de dados em operações de alta frequência. Estes testes podem ser encontrados em `tests/benchmark/queue.service.bench.ts`.

## Considerações de Desempenho

- As implementações locais são otimizadas para operações em memória:
  - `Queue`, `Stack`, `MultiQueue`: O(1) para a maioria das operações
  - `CircularBuffer`: O(1) para todas as operações
  - `PriorityQueue`: O(log n) para enqueue/dequeue, O(1) para peek
  - `DelayQueue`: O(log n) para enqueue, O(1) para peek, O(k) para dequeueReady (onde k é o número de itens prontos)
- Para casos de uso com grandes volumes de dados ou necessidade de persistência, considere implementar as interfaces com sistemas externos como Redis ou bancos de dados.
- A serialização/deserialização de objetos complexos pode afetar o desempenho em implementações externas.