import { HashUtils } from '../../src/services/hash.service';
import * as bcrypt from 'bcryptjs';

/**
 * Testes unitários para a classe HashUtils.
 */
describe('HashUtils', () => {
  describe('bcryptHash', () => {
    it('deve gerar um hash bcrypt válido', () => {
      const value = 'senha123';
      const hash = HashUtils.bcryptHash({ value });

      // Verifica se o hash começa com o formato correto do bcrypt
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Verifica se o hash é válido comparando com o valor original
      expect(bcrypt.compareSync(value, hash)).toBe(true);
    });

    it('deve gerar hashes diferentes para a mesma entrada em chamadas consecutivas', () => {
      const value = 'senha123';
      const hash1 = HashUtils.bcryptHash({ value });
      const hash2 = HashUtils.bcryptHash({ value });

      expect(hash1).not.toBe(hash2);
    });

    it('deve respeitar o número de salt rounds especificado', () => {
      const value = 'senha123';
      const saltRounds = 12;
      const hash = HashUtils.bcryptHash({ value, saltRounds });

      // Verifica se o hash contém o número correto de salt rounds
      expect(hash).toMatch(/^\$2[aby]\$12\$/);
    });

    it('deve lançar erro para valor vazio', () => {
      expect(() => {
        HashUtils.bcryptHash({ value: '' });
      }).toThrow('Invalid input');
    });

    it('deve lançar erro para saltRounds inválido', () => {
      expect(() => {
        HashUtils.bcryptHash({ value: 'senha123', saltRounds: 3 });
      }).toThrow('Invalid saltRounds');
    });
  });

  describe('bcryptCompare', () => {
    it('deve retornar true para comparação de valor correto com hash', () => {
      const value = 'senha123';
      const hash = bcrypt.hashSync(value, 10);

      const result = HashUtils.bcryptCompare({ value, encryptedValue: hash });

      expect(result).toBe(true);
    });

    it('deve retornar false para comparação de valor incorreto com hash', () => {
      const value = 'senha123';
      const wrongValue = 'senha456';
      const hash = bcrypt.hashSync(value, 10);

      const result = HashUtils.bcryptCompare({
        value: wrongValue,
        encryptedValue: hash,
      });

      expect(result).toBe(false);
    });

    it('deve lançar erro para valor vazio', () => {
      expect(() => {
        HashUtils.bcryptCompare({ value: '', encryptedValue: 'hash' });
      }).toThrow('Invalid input');
    });

    it('deve lançar erro para hash vazio', () => {
      expect(() => {
        HashUtils.bcryptCompare({ value: 'senha123', encryptedValue: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('bcryptRandomString', () => {
    it('deve gerar uma string aleatória com formato bcrypt', () => {
      const randomString = HashUtils.bcryptRandomString({});

      // Verifica se a string tem o formato de hash bcrypt
      expect(randomString).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('deve gerar strings diferentes em chamadas consecutivas', () => {
      const randomString1 = HashUtils.bcryptRandomString({});
      const randomString2 = HashUtils.bcryptRandomString({});

      expect(randomString1).not.toBe(randomString2);
    });

    it('deve respeitar o comprimento especificado', () => {
      const length = 12;
      const randomString = HashUtils.bcryptRandomString({ length });

      // Verifica se o hash contém o número correto de salt rounds
      expect(randomString).toMatch(/^\$2[aby]\$12\$/);
    });

    it('deve lançar erro para comprimento inválido', () => {
      expect(() => {
        HashUtils.bcryptRandomString({ length: 3 });
      }).toThrow('Invalid length');
    });
  });

  describe('sha256Hash', () => {
    it('deve gerar um hash SHA-256 válido', () => {
      const value = 'texto para hash';
      const hash = HashUtils.sha256Hash({ value });

      // SHA-256 sempre gera um hash de 64 caracteres hexadecimais
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('deve gerar o mesmo hash para a mesma entrada', () => {
      const value = 'texto para hash';
      const hash1 = HashUtils.sha256Hash({ value });
      const hash2 = HashUtils.sha256Hash({ value });

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para entradas diferentes', () => {
      const hash1 = HashUtils.sha256Hash({ value: 'texto1' });
      const hash2 = HashUtils.sha256Hash({ value: 'texto2' });

      expect(hash1).not.toBe(hash2);
    });

    it('deve lançar erro para valor vazio', () => {
      expect(() => {
        HashUtils.sha256Hash({ value: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('sha256HashJson', () => {
    it('deve gerar um hash SHA-256 válido para um objeto JSON', () => {
      const json = { nome: 'teste', valor: 123 };
      const hash = HashUtils.sha256HashJson({ json });

      // SHA-256 sempre gera um hash de 64 caracteres hexadecimais
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('deve gerar o mesmo hash para o mesmo objeto JSON', () => {
      const json = { nome: 'teste', valor: 123 };
      const hash1 = HashUtils.sha256HashJson({ json });
      const hash2 = HashUtils.sha256HashJson({ json });

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para objetos JSON diferentes', () => {
      const json1 = { nome: 'teste1' };
      const json2 = { nome: 'teste2' };

      const hash1 = HashUtils.sha256HashJson({ json: json1 });
      const hash2 = HashUtils.sha256HashJson({ json: json2 });

      expect(hash1).not.toBe(hash2);
    });

    it('deve lançar erro para entrada não-objeto', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        HashUtils.sha256HashJson('não é um objeto');
      }).toThrow('Invalid input');
    });
  });

  describe('sha256GenerateToken', () => {
    it('deve gerar um token aleatório com o comprimento padrão', () => {
      const token = HashUtils.sha256GenerateToken();

      // Comprimento padrão é 32
      expect(token).toHaveLength(32);
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });

    it('deve gerar um token com o comprimento especificado', () => {
      const length = 16;
      const token = HashUtils.sha256GenerateToken({ length });

      expect(token).toHaveLength(length);
      expect(token).toMatch(/^[0-9a-f]{16}$/);
    });

    it('deve gerar tokens diferentes em chamadas consecutivas', () => {
      const token1 = HashUtils.sha256GenerateToken();
      const token2 = HashUtils.sha256GenerateToken();

      expect(token1).not.toBe(token2);
    });

    it('deve lançar erro para comprimento inválido', () => {
      expect(() => {
        HashUtils.sha256GenerateToken({ length: 0 });
      }).toThrow('Invalid length');
    });
  });

  describe('sha512Hash', () => {
    it('deve gerar um hash SHA-512 válido', () => {
      const value = 'texto para hash';
      const hash = HashUtils.sha512Hash({ value });

      // SHA-512 sempre gera um hash de 128 caracteres hexadecimais
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[0-9a-f]{128}$/);
    });

    it('deve gerar o mesmo hash para a mesma entrada', () => {
      const value = 'texto para hash';
      const hash1 = HashUtils.sha512Hash({ value });
      const hash2 = HashUtils.sha512Hash({ value });

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para entradas diferentes', () => {
      const hash1 = HashUtils.sha512Hash({ value: 'texto1' });
      const hash2 = HashUtils.sha512Hash({ value: 'texto2' });

      expect(hash1).not.toBe(hash2);
    });

    it('deve lançar erro para valor vazio', () => {
      expect(() => {
        HashUtils.sha512Hash({ value: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('sha512HashJson', () => {
    it('deve gerar um hash SHA-512 válido para um objeto JSON', () => {
      const json = { nome: 'teste', valor: 123 };
      const hash = HashUtils.sha512HashJson({ json });

      // SHA-512 sempre gera um hash de 128 caracteres hexadecimais
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[0-9a-f]{128}$/);
    });

    it('deve gerar o mesmo hash para o mesmo objeto JSON', () => {
      const json = { nome: 'teste', valor: 123 };
      const hash1 = HashUtils.sha512HashJson({ json });
      const hash2 = HashUtils.sha512HashJson({ json });

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para objetos JSON diferentes', () => {
      const json1 = { nome: 'teste1' };
      const json2 = { nome: 'teste2' };

      const hash1 = HashUtils.sha512HashJson({ json: json1 });
      const hash2 = HashUtils.sha512HashJson({ json: json2 });

      expect(hash1).not.toBe(hash2);
    });

    it('deve lançar erro para entrada não-objeto', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        HashUtils.sha512HashJson('não é um objeto');
      }).toThrow('Invalid input');
    });
  });

  describe('sha512GenerateToken', () => {
    it('deve gerar um token aleatório com o comprimento padrão', () => {
      const token = HashUtils.sha512GenerateToken();

      // Comprimento padrão é 32
      expect(token).toHaveLength(32);
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });

    it('deve gerar um token com o comprimento especificado', () => {
      const length = 16;
      const token = HashUtils.sha512GenerateToken({ length });

      expect(token).toHaveLength(length);
      expect(token).toMatch(/^[0-9a-f]{16}$/);
    });

    it('deve gerar tokens diferentes em chamadas consecutivas', () => {
      const token1 = HashUtils.sha512GenerateToken();
      const token2 = HashUtils.sha512GenerateToken();

      expect(token1).not.toBe(token2);
    });

    it('deve lançar erro para comprimento inválido', () => {
      expect(() => {
        HashUtils.sha512GenerateToken({ length: 0 });
      }).toThrow('Invalid length');
    });
  });
});
