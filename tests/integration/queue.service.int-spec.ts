import { Queue, Stack, MultiQueue, QueueUtils } from '../../src/services/queue.service';

/**
 * Testes de integração para o serviço de filas.
 * Estes testes verificam o comportamento das estruturas de dados em cenários de uso real.
 */
describe('Queue Service - Testes de Integração', () => {
  describe('Cenário: Sistema de mensagens', () => {
    it('deve processar mensagens na ordem correta usando uma fila', () => {
      // Cenário: Um sistema de mensagens que processa mensagens na ordem de chegada
      const messageQueue = new Queue<{ id: number; text: string; priority: number }>();
      const processedMessages: number[] = [];

      // Adiciona mensagens à fila
      messageQueue.enqueue({ id: 1, text: 'Primeira mensagem', priority: 3 });
      messageQueue.enqueue({ id: 2, text: 'Segunda mensagem', priority: 1 });
      messageQueue.enqueue({ id: 3, text: 'Terceira mensagem', priority: 2 });

      // Processa as mensagens na ordem FIFO
      while (!messageQueue.isEmpty()) {
        const message = messageQueue.dequeue();
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Verifica se as mensagens foram processadas na ordem correta (FIFO)
      expect(processedMessages).toEqual([1, 2, 3]);
    });

    it('deve processar mensagens por prioridade usando uma fila múltipla', () => {
      // Cenário: Um sistema de mensagens que processa mensagens por prioridade
      const priorityQueue = new MultiQueue<{ id: number; text: string }>();
      const processedMessages: number[] = [];

      // Adiciona mensagens com diferentes prioridades
      priorityQueue.enqueue({ id: 1, text: 'Mensagem de baixa prioridade' }, 'low');
      priorityQueue.enqueue({ id: 2, text: 'Mensagem de alta prioridade' }, 'high');
      priorityQueue.enqueue({ id: 3, text: 'Mensagem de média prioridade' }, 'medium');
      priorityQueue.enqueue({ id: 4, text: 'Outra mensagem de alta prioridade' }, 'high');

      // Processa primeiro as mensagens de alta prioridade
      while (!priorityQueue.isEmpty('high')) {
        const message = priorityQueue.dequeue('high');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Depois processa as mensagens de média prioridade
      while (!priorityQueue.isEmpty('medium')) {
        const message = priorityQueue.dequeue('medium');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Por último, processa as mensagens de baixa prioridade
      while (!priorityQueue.isEmpty('low')) {
        const message = priorityQueue.dequeue('low');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Verifica se as mensagens foram processadas na ordem de prioridade correta
      expect(processedMessages).toEqual([2, 4, 3, 1]);
    });
  });

  describe('Cenário: Histórico de navegação', () => {
    it('deve gerenciar o histórico de navegação usando uma pilha', () => {
      // Cenário: Um histórico de navegação de um navegador web
      const navigationHistory = new Stack<string>();
      const forwardHistory = new Stack<string>();
      let currentPage = 'home.html';

      // Função para navegar para uma nova página
      const navigateTo = (page: string) => {
        navigationHistory.push(currentPage);
        currentPage = page;
        // Limpa o histórico para frente ao navegar para uma nova página
        while (!forwardHistory.isEmpty()) {
          forwardHistory.pop();
        }
      };

      // Função para voltar à página anterior
      const goBack = (): string | undefined => {
        if (navigationHistory.isEmpty()) {
          return undefined;
        }
        forwardHistory.push(currentPage);
        currentPage = navigationHistory.pop() as string;
        return currentPage;
      };

      // Função para avançar para a próxima página
      const goForward = (): string | undefined => {
        if (forwardHistory.isEmpty()) {
          return undefined;
        }
        navigationHistory.push(currentPage);
        currentPage = forwardHistory.pop() as string;
        return currentPage;
      };

      // Simula a navegação
      navigateTo('about.html');
      navigateTo('products.html');
      navigateTo('contact.html');

      // Verifica a página atual
      expect(currentPage).toBe('contact.html');

      // Volta duas páginas
      goBack();
      goBack();

      // Verifica a página atual
      expect(currentPage).toBe('about.html');

      // Avança uma página
      goForward();

      // Verifica a página atual
      expect(currentPage).toBe('products.html');

      // Navega para uma nova página, o que deve limpar o histórico para frente
      navigateTo('blog.html');

      // Tenta avançar, o que deve falhar porque o histórico para frente foi limpo
      const result = goForward();
      expect(result).toBeUndefined();

      // Verifica a página atual
      expect(currentPage).toBe('blog.html');
    });
  });

  describe('Cenário: Sistema de tarefas', () => {
    it('deve gerenciar tarefas com diferentes prioridades', () => {
      // Cenário: Um sistema de gerenciamento de tarefas com diferentes prioridades
      const taskSystem = QueueUtils.createMultiQueue<{
        id: number;
        description: string;
        assignee: string;
      }>();

      // Adiciona tarefas com diferentes prioridades
      taskSystem.enqueue(
        { id: 1, description: 'Corrigir bug crítico', assignee: 'Alice' },
        'critical'
      );
      taskSystem.enqueue(
        { id: 2, description: 'Implementar nova funcionalidade', assignee: 'Bob' },
        'normal'
      );
      taskSystem.enqueue(
        { id: 3, description: 'Atualizar documentação', assignee: 'Charlie' },
        'low'
      );
      taskSystem.enqueue(
        { id: 4, description: 'Resolver problema de segurança', assignee: 'Alice' },
        'critical'
      );

      // Verifica o número de tarefas por prioridade
      expect(taskSystem.size('critical')).toBe(2);
      expect(taskSystem.size('normal')).toBe(1);
      expect(taskSystem.size('low')).toBe(1);

      // Processa as tarefas críticas primeiro
      const criticalTasks = [];
      while (!taskSystem.isEmpty('critical')) {
        const task = taskSystem.dequeue('critical');
        if (task) {
          criticalTasks.push(task.id);
        }
      }

      // Verifica se as tarefas críticas foram processadas na ordem correta
      expect(criticalTasks).toEqual([1, 4]);
      expect(taskSystem.isEmpty('critical')).toBe(true);
      expect(taskSystem.isEmpty('normal')).toBe(false);
      expect(taskSystem.isEmpty('low')).toBe(false);
    });
  });

  describe('Cenário: Desfazer/Refazer operações', () => {
    it('deve gerenciar operações de desfazer/refazer usando pilhas', () => {
      // Cenário: Um editor de texto com funcionalidades de desfazer/refazer
      const undoStack = QueueUtils.createStack<{
        action: string;
        data: string;
      }>();
      const redoStack = QueueUtils.createStack<{
        action: string;
        data: string;
      }>();

      let currentText = '';

      // Função para executar uma ação
      const executeAction = (action: string, data: string) => {
        undoStack.push({ action, data });
        // Limpa a pilha de refazer ao executar uma nova ação
        redoStack.clear();

        // Simula a execução da ação
        if (action === 'add') {
          currentText += data;
        } else if (action === 'delete') {
          currentText = currentText.substring(0, currentText.length - parseInt(data));
        }
      };

      // Função para desfazer a última ação
      const undo = () => {
        if (undoStack.isEmpty()) {
          return false;
        }

        const lastAction = undoStack.pop();
        if (!lastAction) {
          return false;
        }

        redoStack.push(lastAction);

        // Simula a reversão da ação
        if (lastAction.action === 'add') {
          currentText = currentText.substring(0, currentText.length - lastAction.data.length);
        } else if (lastAction.action === 'delete') {
          currentText += lastAction.data;
        }

        return true;
      };

      // Função para refazer a última ação desfeita
      const redo = () => {
        if (redoStack.isEmpty()) {
          return false;
        }

        const nextAction = redoStack.pop();
        if (!nextAction) {
          return false;
        }

        undoStack.push(nextAction);

        // Simula a re-execução da ação
        if (nextAction.action === 'add') {
          currentText += nextAction.data;
        } else if (nextAction.action === 'delete') {
          currentText = currentText.substring(0, currentText.length - parseInt(nextAction.data));
        }

        return true;
      };

      // Executa algumas ações
      executeAction('add', 'Hello');
      executeAction('add', ' ');
      executeAction('add', 'World');
      expect(currentText).toBe('Hello World');

      // Desfaz a última ação
      undo();
      expect(currentText).toBe('Hello ');

      // Desfaz outra ação
      undo();
      expect(currentText).toBe('Hello');

      // Refaz uma ação
      redo();
      expect(currentText).toBe('Hello ');

      // Executa uma nova ação, o que deve limpar a pilha de refazer
      executeAction('add', 'Universe');
      expect(currentText).toBe('Hello Universe');

      // Tenta refazer, o que deve falhar porque a pilha de refazer foi limpa
      const redoResult = redo();
      expect(redoResult).toBe(false);
      expect(currentText).toBe('Hello Universe');

      // Desfaz duas ações
      undo();
      undo();
      expect(currentText).toBe('');

      // Verifica o estado das pilhas
      expect(undoStack.isEmpty()).toBe(false);
      expect(redoStack.isEmpty()).toBe(false);
    });
  });
});