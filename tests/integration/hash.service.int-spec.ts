import { HashUtils } from '../../src/services/hash.service';

/**
 * Testes de integração para a classe HashUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('HashUtils - Testes de Integração', () => {
  describe('Fluxo de autenticação', () => {
    it('deve criar um hash bcrypt e validar corretamente', () => {
      // Simula um fluxo de registro e login
      const senha = 'MinhaS3nhaF0rte!';
      
      // Registro: gera hash da senha
      const hashSenha = HashUtils.bcryptHash({ value: senha, saltRounds: 10 });
      
      // Login: valida a senha
      const isValid = HashUtils.bcryptCompare({
        value: senha,
        encryptedValue: hashSenha,
      });
      
      expect(isValid).toBe(true);
      
      // Tentativa com senha incorreta
      const isInvalid = HashUtils.bcryptCompare({
        value: 'SenhaErrada',
        encryptedValue: hashSenha,
      });
      
      expect(isInvalid).toBe(false);
    });
  });

  describe('Combinação de algoritmos de hash', () => {
    it('deve combinar SHA-256 e bcrypt para hash em camadas', () => {
      const originalValue = 'DadosSensíveis123';
      
      // Primeira camada: hash SHA-256
      const sha256Hash = HashUtils.sha256Hash(originalValue);
      
      // Segunda camada: hash bcrypt do resultado SHA-256
      const finalHash = HashUtils.bcryptHash({ value: sha256Hash });
      
      // Verificação: recria o SHA-256 e compara com bcrypt
      const verificationSha256 = HashUtils.sha256Hash(originalValue);
      const isValid = HashUtils.bcryptCompare({
        value: verificationSha256,
        encryptedValue: finalHash,
      });
      
      expect(isValid).toBe(true);
    });
  });

  describe('Verificação de integridade de dados', () => {
    it('deve verificar a integridade de um objeto JSON usando SHA-512', () => {
      // Objeto de dados original
      const originalData = {
        id: 123,
        nome: 'Produto Teste',
        preco: 99.99,
        disponivel: true,
      };
      
      // Gera hash para o objeto original
      const originalHash = HashUtils.sha512HashJson(originalData);
      
      // Simula armazenamento e recuperação dos dados
      const retrievedData = { ...originalData };
      
      // Verifica se os dados não foram alterados
      const retrievedHash = HashUtils.sha512HashJson(retrievedData);
      expect(retrievedHash).toBe(originalHash);
      
      // Simula uma alteração nos dados
      retrievedData.preco = 89.99;
      
      // Verifica que o hash é diferente após a alteração
      const modifiedHash = HashUtils.sha512HashJson(retrievedData);
      expect(modifiedHash).not.toBe(originalHash);
    });
  });

  describe('Geração de tokens de autenticação', () => {
    it('deve gerar e validar tokens de autenticação', () => {
      // Gera um token aleatório
      const token = HashUtils.sha256GenerateToken(32);
      
      // Simula armazenamento do hash do token
      const tokenHash = HashUtils.sha256Hash(token);
      
      // Simula validação do token
      const receivedToken = token; // Em um caso real, isso viria do cliente
      const receivedTokenHash = HashUtils.sha256Hash(receivedToken);
      
      // Verifica se o hash do token recebido corresponde ao hash armazenado
      expect(receivedTokenHash).toBe(tokenHash);
      
      // Simula um token inválido
      const invalidToken = token.substring(0, token.length - 1) + 'X';
      const invalidTokenHash = HashUtils.sha256Hash(invalidToken);
      
      // Verifica que o hash do token inválido não corresponde
      expect(invalidTokenHash).not.toBe(tokenHash);
    });
  });

  describe('Comparação entre algoritmos de hash', () => {
    it('deve demonstrar a diferença entre SHA-256 e SHA-512', () => {
      const testValue = 'TextoParaComparaçãoDeHashes';
      
      // Gera hashes com diferentes algoritmos
      const sha256Result = HashUtils.sha256Hash(testValue);
      const sha512Result = HashUtils.sha512Hash(testValue);
      
      // Verifica que os resultados são diferentes
      expect(sha256Result).not.toBe(sha512Result);
      
      // Verifica os comprimentos corretos
      expect(sha256Result).toHaveLength(64); // 256 bits = 64 caracteres hex
      expect(sha512Result).toHaveLength(128); // 512 bits = 128 caracteres hex
    });
  });
});