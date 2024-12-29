import { init, isCuid } from '@paralleldrive/cuid2'

/**
 * @description Gera um identificador único e seguro (CUID2).
 * @param length O comprimento opcional do CUID. Se não fornecido, será usado o comprimento padrão.
 * @returns Uma string representando o CUID2 gerado.
 */
export function cuidGenerate(length?: number): string {
  const createId = length ? init({ length }) : init()
  return createId()
}

/**
 * @description Verifica se uma string é um CUID2 válido.
 * @param id A string a ser validada.
 * @returns Verdadeiro se a string for um CUID2 válido; caso contrário, falso.
 */
export function cuidIsValid(id: string): boolean {
  return isCuid(id)
}
