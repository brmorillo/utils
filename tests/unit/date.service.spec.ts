import { DateUtils } from '../../src/services/date.service';
import { DateTime, Duration } from 'luxon';

/**
 * Testes unitários para a classe DateUtils.
 */
describe('DateUtils', () => {
  describe('now', () => {
    it('deve retornar a data atual em UTC por padrão', () => {
      const utcNow = DateUtils.now();
      const systemUtcNow = DateTime.utc();

      // Verifica se a diferença é menor que 100ms
      expect(
        Math.abs(utcNow.toMillis() - systemUtcNow.toMillis()),
      ).toBeLessThan(100);
      expect(utcNow.zoneName).toBe('UTC');
    });

    it('deve retornar a data atual no fuso horário local quando utc=false', () => {
      const localNow = DateUtils.now({ utc: false });
      const systemNow = DateTime.now();

      // Verifica se a diferença é menor que 100ms
      expect(Math.abs(localNow.toMillis() - systemNow.toMillis())).toBeLessThan(
        100,
      );
      expect(localNow.zoneName).toBe(systemNow.zoneName);
    });
  });

  describe('createInterval', () => {
    it('deve criar um intervalo entre duas datas DateTime', () => {
      const start = DateTime.fromISO('2023-01-01');
      const end = DateTime.fromISO('2023-12-31');

      const interval = DateUtils.createInterval({
        startDate: start,
        endDate: end,
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });

    it('deve criar um intervalo entre duas strings de data', () => {
      const interval = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });

    it('deve criar um intervalo com combinação de string e DateTime', () => {
      const end = DateTime.fromISO('2023-12-31');

      const interval = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: end,
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });
  });

  describe('addTime', () => {
    it('deve adicionar dias a uma data DateTime', () => {
      const date = DateTime.fromISO('2023-01-01');
      const result = DateUtils.addTime({
        date,
        timeToAdd: { days: 5 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-06');
    });

    it('deve adicionar múltiplas unidades de tempo a uma string de data', () => {
      const result = DateUtils.addTime({
        date: '2023-01-01T12:00:00',
        timeToAdd: { days: 1, hours: 6, minutes: 30 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-02');
      expect(result.hour).toBe(18);
      expect(result.minute).toBe(30);
    });

    it('deve adicionar um objeto Duration a uma data', () => {
      const date = DateTime.fromISO('2023-01-01');
      const duration = Duration.fromObject({
        weeks: 2,
        years: 0,
        quarters: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      const result = DateUtils.addTime({
        date,
        timeToAdd: duration,
      });

      expect(result.toISODate()).toBe('2023-01-15');
    });
  });

  describe('removeTime', () => {
    it('deve remover dias de uma data DateTime', () => {
      const date = DateTime.fromISO('2023-01-10');
      const result = DateUtils.removeTime({
        date,
        timeToRemove: { days: 5 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-05');
    });

    it('deve remover múltiplas unidades de tempo de uma string de data', () => {
      const result = DateUtils.removeTime({
        date: '2023-01-10T12:00:00',
        timeToRemove: { days: 1, hours: 6, minutes: 30 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-09');
      expect(result.hour).toBe(5);
      expect(result.minute).toBe(30);
    });

    it('deve remover um objeto Duration de uma data', () => {
      const date = DateTime.fromISO('2023-01-15');
      const duration = Duration.fromObject({
        weeks: 2,
        years: 0,
        quarters: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      const result = DateUtils.removeTime({
        date,
        timeToRemove: duration,
      });

      expect(result.toISODate()).toBe('2023-01-01');
    });
  });

  describe('diffBetween', () => {
    it('deve calcular a diferença em dias entre duas datas DateTime', () => {
      const start = DateTime.fromISO('2023-01-01');
      const end = DateTime.fromISO('2023-01-11');

      const diff = DateUtils.diffBetween({
        startDate: start,
        endDate: end,
        units: ['days'],
      });

      expect(diff.days).toBe(10);
    });

    it('deve calcular a diferença em múltiplas unidades entre strings de data', () => {
      const diff = DateUtils.diffBetween({
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-03T18:30:00',
        units: ['days', 'hours', 'minutes'],
      });

      expect(diff.days).toBe(2);
      expect(diff.hours).toBe(6);
      expect(diff.minutes).toBe(30);
    });

    it('deve calcular a diferença com datas em diferentes fusos horários', () => {
      const start = DateTime.fromISO('2023-01-01T00:00:00Z'); // UTC
      const end = DateTime.fromISO('2023-01-01T12:00:00+08:00'); // UTC+8

      const diff = DateUtils.diffBetween({
        startDate: start,
        endDate: end,
        units: ['hours'],
      });

      expect(diff.hours).toBe(4); // 12 horas em UTC+8 é 4 horas depois de 00:00 UTC
    });
  });

  describe('toUTC', () => {
    it('deve converter uma data DateTime para UTC', () => {
      const date = DateTime.fromISO('2023-01-01T12:00:00+02:00');
      const utcDate = DateUtils.toUTC({ date });

      expect(utcDate.zoneName).toBe('UTC');
      expect(utcDate.hour).toBe(10); // 12:00 +02:00 = 10:00 UTC
    });

    it('deve converter uma string de data para UTC', () => {
      const utcDate = DateUtils.toUTC({
        date: '2023-01-01T12:00:00+02:00',
      });

      expect(utcDate.zoneName).toBe('UTC');
      expect(utcDate.hour).toBe(10); // 12:00 +02:00 = 10:00 UTC
    });
  });

  describe('toTimeZone', () => {
    it('deve converter uma data DateTime para um fuso horário específico', () => {
      const date = DateTime.fromISO('2023-01-01T12:00:00Z'); // UTC
      const nyDate = DateUtils.toTimeZone({
        date,
        timeZone: 'America/New_York',
      });

      expect(nyDate.zoneName).toBe('America/New_York');
      // A hora exata depende do horário de verão, então verificamos apenas o fuso
      expect(nyDate.offset).not.toBe(0); // Não é UTC
    });

    it('deve converter uma string de data para um fuso horário específico', () => {
      const tokyoDate = DateUtils.toTimeZone({
        date: '2023-01-01T12:00:00Z', // UTC
        timeZone: 'Asia/Tokyo',
      });

      expect(tokyoDate.zoneName).toBe('Asia/Tokyo');
      expect(tokyoDate.hour).toBe(21); // 12:00 UTC = 21:00 Tokyo (+09:00)
    });
  });
});
