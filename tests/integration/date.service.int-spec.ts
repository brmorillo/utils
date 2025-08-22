import { DateUtils } from '../../src/services/date.service';
import { DateTime, Duration } from 'luxon';

/**
 * Testes de integração para a classe DateUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('DateUtils - Testes de Integração', () => {
  describe('Operações encadeadas', () => {
    it('deve calcular corretamente a duração de um evento', () => {
      // Cenário: Calcular a duração de um evento em diferentes unidades
      // 1. Criar um intervalo de datas
      const interval = DateUtils.createInterval({
        startDate: '2023-01-01T10:00:00Z',
        endDate: '2023-01-03T15:30:00Z',
      });

      // 2. Calcular a duração em dias, horas e minutos
      const duration = DateUtils.diffBetween({
        startDate: interval.start || DateTime.fromISO('2023-01-01T10:00:00Z'),
        endDate: interval.end || DateTime.fromISO('2023-01-03T15:30:00Z'),
        units: ['days', 'hours', 'minutes'],
      });

      // 3. Adicionar a duração a uma nova data
      const newDate = DateUtils.addTime({
        date: interval.start || DateTime.fromISO('2023-01-01T10:00:00Z'),
        timeToAdd: duration,
      });

      // Verificações
      expect(duration.days).toBe(2);
      expect(duration.hours).toBe(5);
      expect(duration.minutes).toBe(30);
      expect(newDate.toISO()).toBe(interval.end?.toISO());
    });

    it('deve converter corretamente entre timezones', () => {
      // Cenário: Converter uma data entre diferentes timezones
      // 1. Criar uma data UTC
      const utcDate = DateUtils.now({ utc: true });

      // 2. Converter para timezone de Nova York
      const nyDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'America/New_York',
      });

      // 3. Converter para timezone de Tóquio
      const tokyoDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'Asia/Tokyo',
      });

      // 4. Converter de volta para UTC
      const backToUtc = DateUtils.toUTC({ date: nyDate });

      // Verificações
      expect(utcDate.hour).not.toBe(nyDate.hour); // Horas diferentes em timezones diferentes
      expect(utcDate.hour).not.toBe(tokyoDate.hour);
      expect(nyDate.hour).not.toBe(tokyoDate.hour);
      expect(utcDate.toMillis()).toBe(backToUtc.toMillis()); // Mesmo timestamp ao converter de volta
    });

    it('deve calcular corretamente datas relativas', () => {
      // Cenário: Calcular datas relativas a partir de uma data base
      // 1. Obter a data atual
      const now = DateUtils.now();

      // 2. Calcular uma data no passado (1 mês atrás)
      const oneMonthAgo = DateUtils.removeTime({
        date: now,
        timeToRemove: { months: 1 },
      });

      // 3. Calcular uma data no futuro (2 semanas à frente)
      const twoWeeksLater = DateUtils.addTime({
        date: now,
        timeToAdd: { weeks: 2 },
      });

      // 4. Calcular a diferença entre as datas
      const totalDuration = DateUtils.diffBetween({
        startDate: oneMonthAgo,
        endDate: twoWeeksLater,
        units: ['days'],
      });

      // Verificações
      expect(oneMonthAgo < now).toBe(true);
      expect(twoWeeksLater > now).toBe(true);
      expect(totalDuration.days).toBeGreaterThan(30); // Aproximadamente 1 mês + 2 semanas
    });
  });

  describe('Cenários de uso real', () => {
    it('deve calcular corretamente a interseção de dois intervalos de datas', () => {
      // Cenário: Verificar a sobreposição de dois eventos
      // 1. Criar o primeiro intervalo (10 a 20 de janeiro)
      const interval1 = DateUtils.createInterval({
        startDate: '2023-01-10',
        endDate: '2023-01-20',
      });

      // 2. Criar o segundo intervalo (15 a 25 de janeiro)
      const interval2 = DateUtils.createInterval({
        startDate: '2023-01-15',
        endDate: '2023-01-25',
      });

      // 3. Calcular a interseção dos intervalos
      const intersection = interval1.intersection(interval2);

      // 4. Calcular a duração da interseção
      const duration = intersection ? DateUtils.diffBetween({
        startDate: intersection.start || DateTime.fromISO('2023-01-15'),
        endDate: intersection.end || DateTime.fromISO('2023-01-20'),
        units: ['days'],
      }) : Duration.fromObject({ days: 0 });

      // Verificações
      expect(intersection?.start?.toISODate()).toBe('2023-01-15');
      expect(intersection?.end?.toISODate()).toBe('2023-01-20');
      expect(duration.days).toBe(5);
    });

    it('deve formatar corretamente datas para diferentes regiões', () => {
      // Cenário: Formatar a mesma data para diferentes regiões
      // 1. Criar uma data específica
      const date = DateTime.fromISO('2023-04-15T14:30:00Z');

      // 2. Converter para diferentes timezones
      const dateNY = DateUtils.toTimeZone({
        date,
        timeZone: 'America/New_York',
      });
      const dateTokyo = DateUtils.toTimeZone({
        date,
        timeZone: 'Asia/Tokyo',
      });
      const dateParis = DateUtils.toTimeZone({
        date,
        timeZone: 'Europe/Paris',
      });

      // Verificações
      expect(dateNY.toLocaleString(DateTime.DATETIME_FULL)).toContain('EDT');
      expect(dateTokyo.toLocaleString(DateTime.DATETIME_FULL)).toContain('JST');
      expect(dateParis.toLocaleString(DateTime.DATETIME_FULL)).toContain('CEST');

      // Todas representam o mesmo instante
      expect(dateNY.toUTC().toISO()).toBe(date.toISO());
      expect(dateTokyo.toUTC().toISO()).toBe(date.toISO());
      expect(dateParis.toUTC().toISO()).toBe(date.toISO());
    });

    it('deve calcular corretamente datas de vencimento', () => {
      // Cenário: Calcular datas de vencimento para faturas
      // 1. Data de emissão da fatura
      const issueDate = DateTime.fromISO('2023-03-15');

      // 2. Calcular data de vencimento (30 dias)
      const dueDate = DateUtils.addTime({
        date: issueDate,
        timeToAdd: { days: 30 },
      });

      // 3. Verificar se está atrasada (comparando com uma data futura)
      const checkDate = DateTime.fromISO('2023-04-20'); // 5 dias após o vencimento
      const isOverdue = checkDate > dueDate;

      // 4. Calcular juros (1% ao dia de atraso)
      let lateFee = 0;
      if (isOverdue) {
        const daysLate = DateUtils.diffBetween({
          startDate: dueDate,
          endDate: checkDate,
          units: ['days'],
        }).days;
        lateFee = daysLate * 0.01; // 1% ao dia
      }

      // Verificações
      expect(dueDate.toISODate()).toBe('2023-04-14');
      expect(isOverdue).toBe(true);
      expect(lateFee).toBe(0.06); // 6 dias * 1%
    });
  });

  describe('Manipulação de fusos horários', () => {
    it('deve lidar corretamente com mudanças de horário de verão', () => {
      // Cenário: Lidar com mudança de horário de verão nos EUA (segundo domingo de março)
      // 1. Data antes da mudança de horário de verão
      const beforeDST = DateTime.fromISO('2023-03-11T12:00:00', {
        zone: 'America/New_York',
      });

      // 2. Data depois da mudança de horário de verão
      const afterDST = DateTime.fromISO('2023-03-12T12:00:00', {
        zone: 'America/New_York',
      });

      // 3. Adicionar 24 horas à data antes da mudança
      const add24h = DateUtils.addTime({
        date: beforeDST,
        timeToAdd: { hours: 24 },
      });

      // Verificações
      expect(beforeDST.offset).not.toBe(afterDST.offset); // Offset diferente devido ao horário de verão
      expect(add24h.day).toBe(12); // Mesmo dia
      expect(add24h.hour).toBe(12); // Mesma hora
      expect(add24h.offset).toBe(afterDST.offset); // Mesmo offset após a mudança
    });

    it('deve calcular corretamente durações que atravessam mudanças de horário', () => {
      // Cenário: Calcular duração que atravessa mudança de horário de verão
      // 1. Criar intervalo que atravessa a mudança de horário
      const startDate = DateTime.fromISO('2023-03-11T12:00:00', {
        zone: 'America/New_York',
      });
      const endDate = DateTime.fromISO('2023-03-12T12:00:00', {
        zone: 'America/New_York',
      });

      // 2. Calcular a duração em horas
      const duration = DateUtils.diffBetween({
        startDate,
        endDate,
        units: ['hours'],
      });

      // Verificações
      expect(duration.hours).toBe(23); // 23 horas reais devido à mudança de horário
    });
  });
});