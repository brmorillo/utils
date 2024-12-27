import {
  DateTime,
  Duration,
  DurationLikeObject,
  DurationUnits,
  Interval,
} from 'luxon'

/**
 * Retorna a data e hora atual, em UTC ou no fuso horário do sistema.
 * @param utc Define se a data deve estar em UTC (padrão: false)
 * @returns DateTime da data atual
 */
export function dateNow(utc: boolean = false): DateTime {
  return utc ? DateTime.utc() : DateTime.now()
}

/**
 * Cria um intervalo entre duas datas.
 * @param startDate Data de início (DateTime ou string ISO)
 * @param endDate Data de término (DateTime ou string ISO)
 * @returns Interval entre as datas
 */
export function dateCreateInterval(
  startDate: DateTime | string,
  endDate: DateTime | string,
): Interval {
  const start =
    typeof startDate === 'string' ? DateTime.fromISO(startDate) : startDate
  const end = typeof endDate === 'string' ? DateTime.fromISO(endDate) : endDate
  return Interval.fromDateTimes(start, end)
}

/**
 * Adiciona um tempo específico a uma data.
 * @param date Data inicial (DateTime ou string ISO)
 * @param timeToAdd Objeto representando o tempo a adicionar (ex: { days: 1, hours: 5 })
 * @returns DateTime com o tempo adicionado
 */
export function dateAddTime(
  date: DateTime | string,
  timeToAdd: Duration | object,
): DateTime {
  const startDate = typeof date === 'string' ? DateTime.fromISO(date) : date
  return startDate.plus(Duration.fromObject(timeToAdd))
}

/**
 * Remove um tempo específico de uma data.
 * @param date Data inicial (DateTime ou string ISO)
 * @param timeToRemove Objeto representando o tempo a remover (ex: { weeks: 2 })
 * @returns DateTime com o tempo subtraído
 */
export function dateRemoveTime(
  date: DateTime | string,
  timeToRemove: Duration | object,
): DateTime {
  const startDate = typeof date === 'string' ? DateTime.fromISO(date) : date
  return startDate.minus(Duration.fromObject(timeToRemove))
}

/**
 * Calcula a diferença entre duas datas em unidades específicas.
 * @param startDate Data de início (DateTime ou string)
 * @param endDate Data de término (DateTime ou string)
 * @param units Unidades de tempo para o cálculo (ex: 'days', 'hours')
 * @returns Duration com as unidades e a diferença calculada
 */
export function dateDiffBetween(
  startDate: DateTime | string,
  endDate: DateTime | string,
  units: (keyof DurationLikeObject)[],
): Duration {
  const start =
    typeof startDate === 'string' ? DateTime.fromISO(startDate) : startDate
  const end = typeof endDate === 'string' ? DateTime.fromISO(endDate) : endDate
  return end.diff(start, units)
}

/**
 * Converte uma data para UTC.
 * @param date Data para conversão (DateTime ou string)
 * @returns DateTime em UTC
 */
export function dateToUTC(date: DateTime | string): DateTime {
  const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : date
  return dateTime.toUTC()
}

/**
 * Converte uma data para o fuso horário especificado.
 * @param date Data para conversão (DateTime ou string)
 * @param timeZone String do fuso horário (ex: 'America/New_York')
 * @returns DateTime no fuso horário do usuário
 */
export function dateToTimeZone(
  date: DateTime | string,
  timeZone: string,
): DateTime {
  const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : date
  return dateTime.setZone(timeZone)
}
