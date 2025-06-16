import { CryptUtils } from '../../src/services/crypt.service';
import * as crypto from 'crypto';

/**
 * Testes de benchmark para a classe CryptUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('CryptUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('Geração de IV em massa', () => {
    it('deve gerar 10.000 IVs em tempo razoável', () => {
      const count = 10000;
      const ivs: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ivs.push(CryptUtils.generateIV());
        }
      });

      console.log(
        `Tempo para gerar ${count} IVs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos IVs únicos
      const uniqueIvs = new Set(ivs);
      expect(uniqueIvs.size).toBe(count);

      // O tempo médio por IV deve ser menor que 0.1ms
      const avgTimePerIV = executionTime / count;
      expect(avgTimePerIV).toBeLessThan(0.1);
    });
  });

  describe('Criptografia AES em massa', () => {
    const secretKey = '12345678901234567890123456789012'; // 32 bytes
    const testData = 'Teste de criptografia AES para benchmark';
    const iv = CryptUtils.generateIV();

    it('deve criptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      const encryptedResults: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const { encryptedData } = CryptUtils.aesEncrypt(testData, secretKey, iv);
          encryptedResults.push(encryptedData);
        }
      });

      console.log(
        `Tempo para criptografar ${count} strings com AES: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por criptografia deve ser menor que 0.5ms
      const avgTimePerEncryption = executionTime / count;
      expect(avgTimePerEncryption).toBeLessThan(0.5);
    });

    it('deve descriptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      
      // Criptografa uma string para usar nos testes
      const { encryptedData } = CryptUtils.aesEncrypt(testData, secretKey, iv);

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
        }
      });

      console.log(
        `Tempo para descriptografar ${count} strings com AES: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por descriptografia deve ser menor que 0.5ms
      const avgTimePerDecryption = executionTime / count;
      expect(avgTimePerDecryption).toBeLessThan(0.5);
    });
  });

  describe('Criptografia ChaCha20 em massa', () => {
    const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const nonce = Buffer.from('123456789012'); // 12 bytes
    const testData = 'Teste de criptografia ChaCha20 para benchmark';

    it('deve criptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      const encryptedResults: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const encrypted = CryptUtils.chacha20Encrypt(testData, key, nonce);
          encryptedResults.push(encrypted);
        }
      });

      console.log(
        `Tempo para criptografar ${count} strings com ChaCha20: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por criptografia deve ser menor que 0.5ms
      const avgTimePerEncryption = executionTime / count;
      expect(avgTimePerEncryption).toBeLessThan(0.5);
    });

    it('deve descriptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      
      // Criptografa uma string para usar nos testes
      const encrypted = CryptUtils.chacha20Encrypt(testData, key, nonce);

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.chacha20Decrypt(encrypted, key, nonce);
        }
      });

      console.log(
        `Tempo para descriptografar ${count} strings com ChaCha20: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por descriptografia deve ser menor que 0.5ms
      const avgTimePerDecryption = executionTime / count;
      expect(avgTimePerDecryption).toBeLessThan(0.5);
    });
  });

  describe('Criptografia RC4 em massa', () => {
    const key = 'chave-secreta-rc4-para-benchmark';
    const testData = 'Teste de criptografia RC4 para benchmark';

    it('deve criptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      const encryptedResults: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const encrypted = CryptUtils.rc4Encrypt(testData, key);
          encryptedResults.push(encrypted);
        }
      });

      console.log(
        `Tempo para criptografar ${count} strings com RC4: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por criptografia deve ser menor que 0.2ms
      const avgTimePerEncryption = executionTime / count;
      expect(avgTimePerEncryption).toBeLessThan(0.2);
    });

    it('deve descriptografar 10.000 strings em tempo razoável', () => {
      const count = 10000;
      
      // Criptografa uma string para usar nos testes
      const encrypted = CryptUtils.rc4Encrypt(testData, key);

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.rc4Decrypt(encrypted, key);
        }
      });

      console.log(
        `Tempo para descriptografar ${count} strings com RC4: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por descriptografia deve ser menor que 0.2ms
      const avgTimePerDecryption = executionTime / count;
      expect(avgTimePerDecryption).toBeLessThan(0.2);
    });
  });

  describe('Geração de chaves RSA', () => {
    it('deve gerar 10 pares de chaves RSA em tempo razoável', () => {
      const count = 10;
      const keyPairs: { publicKey: string; privateKey: string }[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          keyPairs.push(CryptUtils.rsaGenerateKeyPair(1024));
        }
      });

      console.log(
        `Tempo para gerar ${count} pares de chaves RSA (1024 bits): ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se as chaves foram geradas corretamente
      expect(keyPairs.length).toBe(count);
      keyPairs.forEach(({ publicKey, privateKey }) => {
        expect(publicKey).toContain('BEGIN RSA PUBLIC KEY');
        expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
      });

      // O tempo médio por geração deve ser razoável (RSA é naturalmente lento)
      const avgTimePerGeneration = executionTime / count;
      expect(avgTimePerGeneration).toBeLessThan(1000); // Menos de 1 segundo por par
    });
  });

  describe('Assinatura e verificação RSA em massa', () => {
    // Gera um par de chaves para todos os testes
    const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
    const testData = 'Dados para assinar com RSA em benchmark';

    it('deve assinar 1.000 mensagens em tempo razoável', () => {
      const count = 1000;
      const signatures: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          signatures.push(CryptUtils.rsaSign(testData, privateKey));
        }
      });

      console.log(
        `Tempo para assinar ${count} mensagens com RSA: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por assinatura deve ser razoável
      const avgTimePerSignature = executionTime / count;
      expect(avgTimePerSignature).toBeLessThan(5); // Menos de 5ms por assinatura
    });

    it('deve verificar 1.000 assinaturas em tempo razoável', () => {
      const count = 1000;
      
      // Cria uma assinatura para verificar repetidamente
      const signature = CryptUtils.rsaSign(testData, privateKey);

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.rsaVerify(testData, signature, publicKey);
        }
      });

      console.log(
        `Tempo para verificar ${count} assinaturas com RSA: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por verificação deve ser razoável
      const avgTimePerVerification = executionTime / count;
      expect(avgTimePerVerification).toBeLessThan(1); // Menos de 1ms por verificação
    });
  });

  describe('Geração de chaves ECC', () => {
    it('deve gerar 50 pares de chaves ECC em tempo razoável', () => {
      const count = 50;
      const keyPairs: { publicKey: string; privateKey: string }[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          keyPairs.push(CryptUtils.eccGenerateKeyPair());
        }
      });

      console.log(
        `Tempo para gerar ${count} pares de chaves ECC: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se as chaves foram geradas corretamente
      expect(keyPairs.length).toBe(count);
      keyPairs.forEach(({ publicKey, privateKey }) => {
        expect(publicKey).toContain('BEGIN PUBLIC KEY');
        expect(privateKey).toContain('BEGIN PRIVATE KEY');
      });

      // O tempo médio por geração deve ser razoável
      const avgTimePerGeneration = executionTime / count;
      expect(avgTimePerGeneration).toBeLessThan(100); // Menos de 100ms por par
    });
  });

  describe('Assinatura e verificação ECC em massa', () => {
    // Gera um par de chaves para todos os testes
    const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
    const testData = 'Dados para assinar com ECC em benchmark';

    it('deve assinar 1.000 mensagens em tempo razoável', () => {
      const count = 1000;
      const signatures: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          signatures.push(CryptUtils.eccSign(testData, privateKey));
        }
      });

      console.log(
        `Tempo para assinar ${count} mensagens com ECC: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por assinatura deve ser razoável
      const avgTimePerSignature = executionTime / count;
      expect(avgTimePerSignature).toBeLessThan(2); // Menos de 2ms por assinatura
    });

    it('deve verificar 1.000 assinaturas em tempo razoável', () => {
      const count = 1000;
      
      // Cria uma assinatura para verificar repetidamente
      const signature = CryptUtils.eccSign(testData, privateKey);

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.eccVerify(testData, signature, publicKey);
        }
      });

      console.log(
        `Tempo para verificar ${count} assinaturas com ECC: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por verificação deve ser razoável
      const avgTimePerVerification = executionTime / count;
      expect(avgTimePerVerification).toBeLessThan(1); // Menos de 1ms por verificação
    });
  });

  describe('Comparação de desempenho entre algoritmos', () => {
    const testData = 'Dados para comparação de desempenho entre algoritmos';
    const aesKey = '12345678901234567890123456789012'; // 32 bytes
    const aesIv = CryptUtils.generateIV();
    const rc4Key = 'chave-secreta-rc4-para-benchmark';

    it('deve comparar o desempenho de criptografia entre AES e RC4', () => {
      const count = 5000;
      
      // Mede o tempo para AES
      const aesTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.aesEncrypt(testData, aesKey, aesIv);
        }
      });
      
      // Mede o tempo para RC4
      const rc4Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.rc4Encrypt(testData, rc4Key);
        }
      });
      
      console.log(`Tempo para ${count} criptografias AES: ${aesTime.toFixed(2)}ms`);
      console.log(`Tempo para ${count} criptografias RC4: ${rc4Time.toFixed(2)}ms`);
      console.log(`RC4 é aproximadamente ${(aesTime / rc4Time).toFixed(2)}x mais rápido que AES`);
      
      // RC4 deve ser mais rápido que AES
      expect(rc4Time).toBeLessThan(aesTime);
    });
  });
});