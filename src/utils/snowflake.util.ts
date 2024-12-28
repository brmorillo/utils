import { Snowflake } from '@sapphire/snowflake'
import {
  DEFAULT_EPOCH,
  DEFAULT_WORKER_ID,
  DEFAULT_PROCESS_ID,
} from '../config/snowflake.config'

// Defina o epoch personalizado (por exemplo, 1º de janeiro de 2024)
const epoch = DEFAULT_EPOCH
const snowflake = new Snowflake(epoch)

/**
 * @description Gera um identificador único do tipo Snowflake.
 * @returns Uma string representando o Snowflake gerado.
 */
export function generateSnowflake(): string {
  return snowflake
    .generate({
      workerId: DEFAULT_WORKER_ID,
      processId: DEFAULT_PROCESS_ID,
    })
    .toString()
}

/**
 * @description Valida se uma string é um Snowflake válido.
 * @param id A string a ser validada.
 * @returns Verdadeiro se a string for um Snowflake válido; caso contrário, falso.
 */
export function isValidSnowflake(id: string): boolean {
  try {
    const bigIntId = BigInt(id)
    const { timestamp, workerId, processId, increment } =
      snowflake.deconstruct(bigIntId)
    // Verifica se os componentes decompostos são válidos
    return (
      timestamp >= new Date(epoch).getTime() &&
      workerId >= 0 &&
      processId >= 0 &&
      increment >= 0
    )
  } catch {
    return false
  }
}
