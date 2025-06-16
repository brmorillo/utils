import { DateUtils } from '../../src/services/date.service';
import { DateTime, Duration } from 'luxon';

/**
 * Testes de integração para a classe DateUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('DateUtils - Testes de Integração', () => {
  describe('Fluxos de trabalho com datas', () => {
    it('deve criar um intervalo, calcular a diferença e manipular datas corretamente', () => {
      // Cria um intervalo de 10 dias
      const interval = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: '2023-01-11',
      });

      // Calcula a diferença em dias
      const diff = DateUtils.diffBetween({
        startDate: interval.start,
        endDate: interval.end,
        units: ['days'],
      });

      // Adiciona metade da diferença à data inicial
      const middleDate = DateUtils.addTime({
        date: interval.start,
        timeToAdd: { days: diff.days / 2 },
      });

      // Verifica se o resultado está correto
      expect(diff.days).toBe(10);
      expect(middleDate.toISODate()).toBe('2023-01-06');
    });

    it('deve converter entre fusos horários e calcular diferenças corretamente', () => {
      // Data em UTC
      const utcDate = DateTime.fromISO('2023-01-01T12:00:00Z');

      // Converte para Nova York
      const nyDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'America/New_York',
      });

      // Converte para Tokyo
      const tokyoDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'Asia/Tokyo',
      });

      // Calcula a diferença entre Tokyo e Nova York
      const diff = DateUtils.diffBetween({
        startDate: nyDate,
        endDate: tokyoDate,
        units: ['hours'],
      });

      // A diferença deve ser próxima de 0 porque ambas as datas
      // representam o mesmo momento, apenas em fusos diferentes
      expect(Math.abs(diff.hours)).toBeLessThan(0.1);

      // Mas os offsets devem ser diferentes
      expect(nyDate.offset).not.toBe(tokyoDate.offset);
    });
  });

  describe('Manipulação de datas em cadeia', () => {
    it('deve encadear operações de adição e remoção de tempo corretamente', () => {
      const startDate = '2023-01-01T12:00:00';

      // Adiciona 5 dias
      const date1 = DateUtils.addTime({
        date: startDate,
        timeToAdd: { days: 5 },
      });

      // Adiciona 10 horas
      const date2 = DateUtils.addTime({
        date: date1,
        timeToAdd: { hours: 10 },
      });

      // Remove 2 dias
      const date3 = DateUtils.removeTime({
        date: date2,
        timeToRemove: { days: 2 },
      });

      // Verifica o resultado final
      expect(date3.toISODate()).toBe('2023-01-04');
      expect(date3.hour).toBe(22);
    });
  });

  describe('Cálculos complexos de intervalos', () => {
    it('deve calcular corretamente sobreposições de intervalos', () => {
      // Cria dois intervalos que se sobrepõem
      const interval1 = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: '2023-01-15',
      });

      const interval2 = DateUtils.createInterval({
        startDate: '2023-01-10',
        endDate: '2023-01-20',
      });

      // Verifica a sobreposição
      const overlaps = interval1.overlaps(interval2);
      expect(overlaps).toBe(true);

      // Calcula o intervalo de sobreposição
      const intersection = interval1.intersection(interval2);

      // Verifica as datas da sobreposição
      expect(intersection.start.toISODate()).toBe('2023-01-10');
      expect(intersection.end.toISODate()).toBe('2023-01-15');

      // Calcula a duração da sobreposição
      const overlapDuration = DateUtils.diffBetween({
        startDate: intersection.start,
        endDate: intersection.end,
        units: ['days'],
      });

      expect(overlapDuration.days).toBe(5);
    });
  });

  describe('Conversões de fuso horário em cadeia', () => {
    it('deve manter a consistência ao converter entre múltiplos fusos horários', () => {
      // Começa com uma data em UTC
      const utcDate = DateUtils.now({ utc: true });

      // Converte para Tokyo
      const tokyoDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'Asia/Tokyo',
      });

      // Converte para Los Angeles
      const laDate = DateUtils.toTimeZone({
        date: tokyoDate,
        timeZone: 'America/Los_Angeles',
      });

      // Converte de volta para UTC
      const backToUtc = DateUtils.toUTC({ date: laDate });

      // Verifica se a data original e a final são iguais
      expect(backToUtc.toMillis()).toBe(utcDate.toMillis());
    });
  });
});
