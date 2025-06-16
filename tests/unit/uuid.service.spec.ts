import { UUIDUtils } from '../../src/services/uuid.service';

/**
 * Testes unitários para a classe UUIDUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('UUIDUtils - Testes Unitários', () => {
  describe('uuidV1Generate', () => {
    it('deve gerar um UUID v1 válido', () => {
      const uuid = UUIDUtils.uuidV1Generate();

      // Verifica se é uma string
      expect(typeof uuid).toBe('string');

      // Verifica se tem o formato correto de UUID
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verifica se é válido usando o próprio método de validação
      expect(UUIDUtils.uuidIsValid({ id: uuid })).toBe(true);
    });

    it('deve gerar UUIDs v1 únicos em chamadas consecutivas', () => {
      const uuid1 = UUIDUtils.uuidV1Generate();
      const uuid2 = UUIDUtils.uuidV1Generate();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('uuidV4Generate', () => {
    it('deve gerar um UUID v4 válido', () => {
      const uuid = UUIDUtils.uuidV4Generate();

      // Verifica se é uma string
      expect(typeof uuid).toBe('string');

      // Verifica se tem o formato correto de UUID v4
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verifica se é válido usando o próprio método de validação
      expect(UUIDUtils.uuidIsValid({ id: uuid })).toBe(true);
    });

    it('deve gerar UUIDs v4 únicos em chamadas consecutivas', () => {
      const uuid1 = UUIDUtils.uuidV4Generate();
      const uuid2 = UUIDUtils.uuidV4Generate();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('uuidV5Generate', () => {
    it('deve gerar um UUID v5 válido com namespace e nome', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Namespace DNS
      const name = 'example.com';

      const uuid = UUIDUtils.uuidV5Generate({ namespace, name });

      // Verifica se é uma string
      expect(typeof uuid).toBe('string');

      // Verifica se tem o formato correto de UUID v5
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verifica se é válido usando o próprio método de validação
      expect(UUIDUtils.uuidIsValid({ id: uuid })).toBe(true);
    });

    it('deve gerar o mesmo UUID v5 para o mesmo namespace e nome', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const name = 'example.com';

      const uuid1 = UUIDUtils.uuidV5Generate({ namespace, name });
      const uuid2 = UUIDUtils.uuidV5Generate({ namespace, name });

      expect(uuid1).toBe(uuid2);
    });

    it('deve gerar UUIDs v5 diferentes para nomes diferentes com o mesmo namespace', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const name1 = 'example.com';
      const name2 = 'example.org';

      const uuid1 = UUIDUtils.uuidV5Generate({ namespace, name: name1 });
      const uuid2 = UUIDUtils.uuidV5Generate({ namespace, name: name2 });

      expect(uuid1).not.toBe(uuid2);
    });

    it('deve gerar um UUID v5 válido sem namespace fornecido', () => {
      const name = 'example.com';

      const uuid = UUIDUtils.uuidV5Generate({ name });

      // Verifica se é uma string
      expect(typeof uuid).toBe('string');

      // Verifica se tem o formato correto de UUID v5
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verifica se é válido usando o próprio método de validação
      expect(UUIDUtils.uuidIsValid({ id: uuid })).toBe(true);
    });
  });

  describe('uuidIsValid', () => {
    it('deve validar um UUID v1 como válido', () => {
      const uuid = UUIDUtils.uuidV1Generate();
      const isValid = UUIDUtils.uuidIsValid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('deve validar um UUID v4 como válido', () => {
      const uuid = UUIDUtils.uuidV4Generate();
      const isValid = UUIDUtils.uuidIsValid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('deve validar um UUID v5 como válido', () => {
      const uuid = UUIDUtils.uuidV5Generate({ name: 'test' });
      const isValid = UUIDUtils.uuidIsValid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('deve validar uma string não-UUID como inválida', () => {
      const invalidUuids = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456-4266554400', // muito curto
        '123e4567-e89b-12d3-a456-42665544000000', // muito longo
        '123e4567-e89b-12d3-a456_426655440000', // caractere inválido
        '123e4567-e89b-12d3-a456', // incompleto
        '', // vazio
      ];

      invalidUuids.forEach(invalidUuid => {
        const isValid = UUIDUtils.uuidIsValid({ id: invalidUuid });
        expect(isValid).toBe(false);
      });
    });
  });
});
