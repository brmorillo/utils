import * as crypto from 'crypto';
import { CryptUtils } from '../../src/services/crypt.service';

/**
 * Testes de integração para a classe CryptUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('CryptUtils - Testes de Integração', () => {
  describe('Fluxo completo de criptografia AES', () => {
    it('deve criptografar, descriptografar e manter a integridade dos dados', () => {
      const secretKey = '12345678901234567890123456789012'; // 32 bytes
      const originalData = {
        id: 1,
        nome: 'Teste de Integração',
        detalhes: {
          tipo: 'confidencial',
          nivel: 3,
          tags: ['seguro', 'criptografado'],
        },
      };

      // Gerar IV
      const iv = CryptUtils.generateIV();

      // Criptografar dados
      const { encryptedData } = CryptUtils.aesEncrypt(
        originalData,
        secretKey,
        iv,
      );

      // Descriptografar dados
      const decryptedData = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);

      // Verificar se os dados foram preservados corretamente
      expect(decryptedData).toEqual(originalData);
    });
  });

  describe('Assinatura e verificação com diferentes algoritmos', () => {
    const testData = 'Dados para teste de assinatura e verificação';

    it('deve assinar com RSA e verificar corretamente', () => {
      // Gerar par de chaves RSA
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);

      // Assinar dados
      const signature = CryptUtils.rsaSign(testData, privateKey);

      // Verificar assinatura
      const isValid = CryptUtils.rsaVerify(testData, signature, publicKey);

      expect(isValid).toBe(true);
    });

    it('deve assinar com ECC e verificar corretamente', () => {
      // Gerar par de chaves ECC
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();

      // Assinar dados
      const signature = CryptUtils.eccSign(testData, privateKey);

      // Verificar assinatura
      const isValid = CryptUtils.eccVerify(testData, signature, publicKey);

      expect(isValid).toBe(true);
    });

    it('deve detectar assinatura inválida entre algoritmos diferentes', () => {
      // Gerar pares de chaves
      const rsaKeys = CryptUtils.rsaGenerateKeyPair(1024);
      const eccKeys = CryptUtils.eccGenerateKeyPair();

      // Assinar com RSA
      const rsaSignature = CryptUtils.rsaSign(testData, rsaKeys.privateKey);

      // Tentar verificar assinatura RSA com chave ECC (deve falhar)
      const isValid = CryptUtils.eccVerify(
        testData,
        rsaSignature,
        eccKeys.publicKey,
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Criptografia em camadas', () => {
    it('deve aplicar múltiplas camadas de criptografia e descriptografar corretamente', () => {
      const originalData =
        'Dados sensíveis para múltiplas camadas de criptografia';

      // Camada 1: RC4
      const rc4Key = 'chave-rc4-secreta';
      const rc4Encrypted = CryptUtils.rc4Encrypt(originalData, rc4Key);

      // Camada 2: AES
      const aesKey = '12345678901234567890123456789012';
      const aesIV = CryptUtils.generateIV();
      const { encryptedData: aesEncrypted } = CryptUtils.aesEncrypt(
        rc4Encrypted,
        aesKey,
        aesIV,
      );

      // Camada 3: RSA
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const finalEncrypted = CryptUtils.rsaEncrypt(aesEncrypted, publicKey);

      // Descriptografar na ordem inversa
      // Camada 3: RSA
      const rsaDecrypted = CryptUtils.rsaDecrypt(finalEncrypted, privateKey);

      // Camada 2: AES
      const aesDecrypted = CryptUtils.aesDecrypt(rsaDecrypted, aesKey, aesIV);

      // Camada 1: RC4
      const finalDecrypted = CryptUtils.rc4Decrypt(
        aesDecrypted as string,
        rc4Key,
      );

      // Verificar se os dados originais foram recuperados
      expect(finalDecrypted).toBe(originalData);
    });
  });

  describe('Compatibilidade entre diferentes algoritmos', () => {
    it('deve criptografar com diferentes algoritmos e comparar resultados', () => {
      const testData = 'Dados para teste de compatibilidade';
      const key32 = '12345678901234567890123456789012'; // 32 bytes
      const iv16 = '1234567890123456'; // 16 bytes

      // Criptografar com AES
      const { encryptedData: aesEncrypted } = CryptUtils.aesEncrypt(
        testData,
        key32,
        iv16,
      );

      // Criptografar com RC4
      const rc4Encrypted = CryptUtils.rc4Encrypt(testData, key32);

      // Verificar que as saídas são diferentes (algoritmos diferentes)
      expect(aesEncrypted).not.toBe(rc4Encrypted);

      // Descriptografar e verificar que ambos recuperam os dados originais
      const aesDecrypted = CryptUtils.aesDecrypt(aesEncrypted, key32, iv16);
      const rc4Decrypted = CryptUtils.rc4Decrypt(rc4Encrypted, key32);

      expect(aesDecrypted).toBe(testData);
      expect(rc4Decrypted).toBe(testData);
    });
  });
});
