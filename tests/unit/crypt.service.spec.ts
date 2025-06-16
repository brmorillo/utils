import * as crypto from 'crypto';
import { CryptUtils } from '../../src/services/crypt.service';

/**
 * Testes unitários para a classe CryptUtils.
 */
describe('CryptUtils', () => {
  describe('generateIV', () => {
    it('deve gerar um IV de 16 bytes (32 caracteres hexadecimais)', () => {
      const iv = CryptUtils.generateIV();
      expect(iv).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/.test(iv)).toBe(true);
    });

    it('deve gerar IVs diferentes em chamadas consecutivas', () => {
      const iv1 = CryptUtils.generateIV();
      const iv2 = CryptUtils.generateIV();
      expect(iv1).not.toBe(iv2);
    });
  });

  describe('aesEncrypt e aesDecrypt', () => {
    const secretKey = '12345678901234567890123456789012'; // 32 bytes
    const testData = 'Teste de criptografia AES';
    const testObject = { nome: 'Teste', valor: 123 };

    it('deve criptografar e descriptografar uma string corretamente', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(32);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toBe(testData);
    });

    it('deve criptografar e descriptografar um objeto JSON corretamente', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testObject, secretKey);
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(32);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toEqual(testObject);
    });

    it('deve usar o IV fornecido quando especificado', () => {
      const customIV = '1234567890abcdef1234567890abcdef';
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testData, secretKey, customIV);
      expect(iv).toBe(customIV);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toBe(testData);
    });

    it('deve lançar erro para chave secreta inválida na criptografia', () => {
      expect(() => {
        CryptUtils.aesEncrypt(testData, 'chave-curta');
      }).toThrow('Invalid secretKey');
    });

    it('deve lançar erro para chave secreta inválida na descriptografia', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(() => {
        CryptUtils.aesDecrypt(encryptedData, 'chave-curta', iv);
      }).toThrow('Invalid secretKey');
    });

    it('deve lançar erro para IV inválido na descriptografia', () => {
      const { encryptedData } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(() => {
        CryptUtils.aesDecrypt(encryptedData, secretKey, 'iv-invalido');
      }).toThrow('Invalid IV');
    });

    it('deve lançar erro para dados inválidos na criptografia', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        CryptUtils.aesEncrypt(123, secretKey);
      }).toThrow('Invalid input');
    });
  });

  // Pulando testes de ChaCha20 que não são suportados em todas as versões do Node.js
  describe.skip('chacha20Encrypt e chacha20Decrypt', () => {
    const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const nonce = Buffer.from('123456789012'); // 12 bytes
    const testData = 'Teste de criptografia ChaCha20';

    it('deve criptografar e descriptografar uma string corretamente', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log('ChaCha20 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      const encrypted = CryptUtils.chacha20Encrypt(testData, key, nonce);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.chacha20Decrypt(encrypted, key, nonce);
      expect(decrypted).toBe(testData);
    });

    it('deve lançar erro para chave inválida na criptografia', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log('ChaCha20 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      const invalidKey = Buffer.from('chave-curta');
      expect(() => {
        CryptUtils.chacha20Encrypt(testData, invalidKey, nonce);
      }).toThrow('Invalid key');
    });

    it('deve lançar erro para nonce inválido na criptografia', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log('ChaCha20 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      const invalidNonce = Buffer.from('nonce-curto');
      expect(() => {
        CryptUtils.chacha20Encrypt(testData, key, invalidNonce);
      }).toThrow('Invalid nonce');
    });
  });

  describe('rsaGenerateKeyPair, rsaEncrypt e rsaDecrypt', () => {
    it('deve gerar um par de chaves RSA válido', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(publicKey).toContain('BEGIN RSA PUBLIC KEY');
      expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
    });

    it('deve criptografar e descriptografar uma string corretamente com RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'Teste de criptografia RSA';

      const encrypted = CryptUtils.rsaEncrypt(testData, publicKey);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.rsaDecrypt(encrypted, privateKey);
      expect(decrypted).toBe(testData);
    });

    it('deve lançar erro para dados inválidos na criptografia RSA', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        CryptUtils.rsaEncrypt(null, publicKey);
      }).toThrow('Invalid input');
    });

    it('deve lançar erro para chave pública inválida na criptografia RSA', () => {
      expect(() => {
        CryptUtils.rsaEncrypt('teste', 'chave-invalida');
      }).toThrow();
    });

    it('deve lançar erro para dados criptografados inválidos na descriptografia RSA', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        CryptUtils.rsaDecrypt('dados-invalidos', privateKey);
      }).toThrow();
    });
  });

  describe('rsaSign e rsaVerify', () => {
    it('deve assinar e verificar uma string corretamente com RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'Dados para assinar com RSA';

      const signature = CryptUtils.rsaSign(testData, privateKey);
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.rsaVerify(testData, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('deve retornar false para assinatura inválida', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'Dados para assinar com RSA';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.rsaVerify(testData, fakeSignature, publicKey);
      expect(isValid).toBe(false);
    });

    it('deve lançar erro para dados inválidos na assinatura RSA', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        CryptUtils.rsaSign(null, privateKey);
      }).toThrow('Invalid input');
    });

    it('deve lançar erro para chave privada inválida na assinatura RSA', () => {
      expect(() => {
        CryptUtils.rsaSign('teste', 'chave-invalida');
      }).toThrow();
    });
  });

  describe('eccGenerateKeyPair, eccSign e eccVerify', () => {
    it('deve gerar um par de chaves ECC válido', () => {
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
      expect(publicKey).toContain('BEGIN PUBLIC KEY');
      expect(privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('deve assinar e verificar uma string corretamente com ECC', () => {
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
      const testData = 'Dados para assinar com ECC';

      const signature = CryptUtils.eccSign(testData, privateKey);
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.eccVerify(testData, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('deve retornar false para assinatura ECC inválida', () => {
      const { publicKey } = CryptUtils.eccGenerateKeyPair();
      const testData = 'Dados para assinar com ECC';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.eccVerify(testData, fakeSignature, publicKey);
      expect(isValid).toBe(false);
    });
  });

  // Pulando testes de RC4 que não são suportados em todas as versões do Node.js
  describe.skip('rc4Encrypt e rc4Decrypt', () => {
    const key = 'chave-secreta-rc4';
    const testData = 'Teste de criptografia RC4';

    it('deve criptografar e descriptografar uma string corretamente com RC4', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log('RC4 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      const encrypted = CryptUtils.rc4Encrypt(testData, key);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.rc4Decrypt(encrypted, key);
      expect(decrypted).toBe(testData);
    });

    it('deve lançar erro para dados inválidos na criptografia RC4', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log('RC4 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        CryptUtils.rc4Encrypt(null, key);
      }).toThrow('Invalid input');
    });

    it('deve lançar erro para chave inválida na criptografia RC4', () => {
      // Verificar se o algoritmo é suportado antes de executar o teste
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log('RC4 não é suportado nesta versão do Node.js. Pulando teste.');
        return;
      }
      
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        CryptUtils.rc4Encrypt(testData, null);
      }).toThrow('Invalid key');
    });
  });
});