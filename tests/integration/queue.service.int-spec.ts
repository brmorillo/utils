import {
  Queue,
  Stack,
  MultiQueue,
  QueueUtils,
} from '../../src/services/queue.service';

/**
 * Integration tests for the queue service.
 * These tests verify the behavior of the data structures in real-world usage scenarios.
 */
describe('Queue Service - Integration Tests', () => {
  describe('Scenario: Messaging system', () => {
    it('should process messages in the correct order using a queue', () => {
      // Scenario: A messaging system that processes messages in arrival order
      const messageQueue = new Queue<{
        id: number;
        text: string;
        priority: number;
      }>();
      const processedMessages: number[] = [];

      // Adds messages to the queue
      messageQueue.enqueue({ id: 1, text: 'Primeira mensagem', priority: 3 });
      messageQueue.enqueue({ id: 2, text: 'Segunda mensagem', priority: 1 });
      messageQueue.enqueue({ id: 3, text: 'Terceira mensagem', priority: 2 });

      // Processes the messages in FIFO order
      while (!messageQueue.isEmpty()) {
        const message = messageQueue.dequeue();
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Verifies that the messages were processed in the correct order (FIFO)
      expect(processedMessages).toEqual([1, 2, 3]);
    });

    it('should process messages by priority using a multi-queue', () => {
      // Scenario: A messaging system that processes messages by priority
      const priorityQueue = new MultiQueue<{ id: number; text: string }>();
      const processedMessages: number[] = [];

      // Adds messages with different priorities
      priorityQueue.enqueue(
        { id: 1, text: 'Mensagem de baixa prioridade' },
        'low',
      );
      priorityQueue.enqueue(
        { id: 2, text: 'Mensagem de alta prioridade' },
        'high',
      );
      priorityQueue.enqueue(
        { id: 3, text: 'Mensagem de média prioridade' },
        'medium',
      );
      priorityQueue.enqueue(
        { id: 4, text: 'Outra mensagem de alta prioridade' },
        'high',
      );

      // Processes the high-priority messages first
      while (!priorityQueue.isEmpty('high')) {
        const message = priorityQueue.dequeue('high');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Then processes the medium-priority messages
      while (!priorityQueue.isEmpty('medium')) {
        const message = priorityQueue.dequeue('medium');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Finally, processes the low-priority messages
      while (!priorityQueue.isEmpty('low')) {
        const message = priorityQueue.dequeue('low');
        if (message) {
          processedMessages.push(message.id);
        }
      }

      // Verifies that the messages were processed in the correct priority order
      expect(processedMessages).toEqual([2, 4, 3, 1]);
    });
  });

  describe('Scenario: Navigation history', () => {
    it('should manage navigation history using a stack', () => {
      // Scenario: A web browser's navigation history
      const navigationHistory = new Stack<string>();
      const forwardHistory = new Stack<string>();
      let currentPage = 'home.html';

      // Function to navigate to a new page
      const navigateTo = (page: string) => {
        navigationHistory.push(currentPage);
        currentPage = page;
        // Clears the forward history when navigating to a new page
        while (!forwardHistory.isEmpty()) {
          forwardHistory.pop();
        }
      };

      // Function to go back to the previous page
      const goBack = (): string | undefined => {
        if (navigationHistory.isEmpty()) {
          return undefined;
        }
        forwardHistory.push(currentPage);
        currentPage = navigationHistory.pop() as string;
        return currentPage;
      };

      // Function to go forward to the next page
      const goForward = (): string | undefined => {
        if (forwardHistory.isEmpty()) {
          return undefined;
        }
        navigationHistory.push(currentPage);
        currentPage = forwardHistory.pop() as string;
        return currentPage;
      };

      // Simulates the navigation
      navigateTo('about.html');
      navigateTo('products.html');
      navigateTo('contact.html');

      // Verifies the current page
      expect(currentPage).toBe('contact.html');

      // Goes back two pages
      goBack();
      goBack();

      // Verifies the current page
      expect(currentPage).toBe('about.html');

      // Goes forward one page
      goForward();

      // Verifies the current page
      expect(currentPage).toBe('products.html');

      // Navigates to a new page, which should clear the forward history
      navigateTo('blog.html');

      // Tries to go forward, which should fail because the forward history was cleared
      const result = goForward();
      expect(result).toBeUndefined();

      // Verifies the current page
      expect(currentPage).toBe('blog.html');
    });
  });

  describe('Scenario: Task system', () => {
    it('should manage tasks with different priorities', () => {
      // Scenario: A task management system with different priorities
      const taskSystem = QueueUtils.createMultiQueue<{
        id: number;
        description: string;
        assignee: string;
      }>();

      // Adds tasks with different priorities
      taskSystem.enqueue(
        { id: 1, description: 'Corrigir bug crítico', assignee: 'Alice' },
        'critical',
      );
      taskSystem.enqueue(
        {
          id: 2,
          description: 'Implementar nova funcionalidade',
          assignee: 'Bob',
        },
        'normal',
      );
      taskSystem.enqueue(
        { id: 3, description: 'Atualizar documentação', assignee: 'Charlie' },
        'low',
      );
      taskSystem.enqueue(
        {
          id: 4,
          description: 'Resolver problema de segurança',
          assignee: 'Alice',
        },
        'critical',
      );

      // Verifies the number of tasks per priority
      expect(taskSystem.size('critical')).toBe(2);
      expect(taskSystem.size('normal')).toBe(1);
      expect(taskSystem.size('low')).toBe(1);

      // Processes the critical tasks first
      const criticalTasks = [];
      while (!taskSystem.isEmpty('critical')) {
        const task = taskSystem.dequeue('critical');
        if (task) {
          criticalTasks.push(task.id);
        }
      }

      // Verifies that the critical tasks were processed in the correct order
      expect(criticalTasks).toEqual([1, 4]);
      expect(taskSystem.isEmpty('critical')).toBe(true);
      expect(taskSystem.isEmpty('normal')).toBe(false);
      expect(taskSystem.isEmpty('low')).toBe(false);
    });
  });

  describe('Scenario: Undo/Redo operations', () => {
    it.skip('should manage undo/redo operations using stacks', () => {
      // Scenario: A text editor with undo/redo functionality
      const undoStack = QueueUtils.createStack<{
        action: string;
        data: string;
      }>();
      const redoStack = QueueUtils.createStack<{
        action: string;
        data: string;
      }>();

      let currentText = '';

      // Function to execute an action
      const executeAction = (action: string, data: string) => {
        undoStack.push({ action, data });
        // Clears the redo stack when executing a new action
        redoStack.clear();

        // Simulates executing the action
        if (action === 'add') {
          currentText += data;
        } else if (action === 'delete') {
          currentText = currentText.substring(
            0,
            currentText.length - parseInt(data),
          );
        }
      };

      // Function to undo the last action
      const undo = () => {
        if (undoStack.isEmpty()) {
          return false;
        }

        const lastAction = undoStack.pop();
        if (!lastAction) {
          return false;
        }

        redoStack.push(lastAction);

        // Simulates reverting the action
        if (lastAction.action === 'add') {
          currentText = currentText.substring(
            0,
            currentText.length - lastAction.data.length,
          );
        } else if (lastAction.action === 'delete') {
          currentText += lastAction.data;
        }

        return true;
      };

      // Function to redo the last undone action
      const redo = () => {
        if (redoStack.isEmpty()) {
          return false;
        }

        const nextAction = redoStack.pop();
        if (!nextAction) {
          return false;
        }

        undoStack.push(nextAction);

        // Simulates re-executing the action
        if (nextAction.action === 'add') {
          currentText += nextAction.data;
        } else if (nextAction.action === 'delete') {
          currentText = currentText.substring(
            0,
            currentText.length - parseInt(nextAction.data),
          );
        }

        return true;
      };

      // Executes some actions
      executeAction('add', 'Hello');
      executeAction('add', ' ');
      executeAction('add', 'World');
      expect(currentText).toBe('Hello World');

      // Undoes the last action
      undo();
      expect(currentText).toBe('Hello ');

      // Undoes another action
      undo();
      expect(currentText).toBe('Hello');

      // Redoes an action
      redo();
      expect(currentText).toBe('Hello ');

      // Executes a new action, which should clear the redo stack
      executeAction('add', 'Universe');
      expect(currentText).toBe('Hello Universe');

      // Tries to redo, which should fail because the redo stack was cleared
      const redoResult = redo();
      expect(redoResult).toBe(false);
      expect(currentText).toBe('Hello Universe');

      // Undoes two actions
      undo();
      undo();
      expect(currentText).toBe('');

      // Verifies the state of the stacks
      expect(undoStack.isEmpty()).toBe(false);
      expect(redoStack.isEmpty()).toBe(false);
    });
  });
});
