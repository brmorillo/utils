import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Testes de integração para a classe JWTUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('JWTUtils - Testes de Integração', () => {
  const secretKey = 'integration-test-secret-key';

  describe('Cenários de uso real', () => {
    it('deve simular um fluxo completo de autenticação com JWT', () => {
      // 1. Gerar um token para um usuário (simulando login)
      const userData = {
        id: '12345',
        username: 'testuser',
        role: 'user',
        permissions: ['read', 'write']
      };
      
      const token = JWTUtils.generate({
        payload: userData,
        secretKey,
        options: { expiresIn: '15m' }
      });
      
      // 2. Verificar o token (simulando validação de uma requisição autenticada)
      const decoded = JWTUtils.verify({
        token,
        secretKey,
      }) as any;
      
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      expect(decoded.role).toBe(userData.role);
      expect(decoded.permissions).toEqual(userData.permissions);
      
      // 3. Verificar se o token não está expirado
      const isExpired = JWTUtils.isExpired({ token });
      expect(isExpired).toBe(false);
      
      // 4. Verificar o tempo restante de validade
      const remainingTime = JWTUtils.getExpirationTime({ token });
      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(15 * 60); // 15 minutos em segundos
      
      // 5. Renovar o token (simulando refresh de token)
      const refreshedToken = JWTUtils.refresh({
        token,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      // 6. Verificar se o token renovado mantém os dados do usuário
      const refreshedDecoded = JWTUtils.verify({
        token: refreshedToken,
        secretKey
      }) as any;
      
      expect(refreshedDecoded.id).toBe(userData.id);
      expect(refreshedDecoded.username).toBe(userData.username);
      expect(refreshedDecoded.role).toBe(userData.role);
      expect(refreshedDecoded.permissions).toEqual(userData.permissions);
      
      // 7. Verificar se o token renovado tem um tempo de expiração maior
      const refreshedRemainingTime = JWTUtils.getExpirationTime({ token: refreshedToken });
      expect(refreshedRemainingTime).toBeGreaterThan(remainingTime);
    });

    it('deve simular um cenário de autorização baseada em roles e permissões', () => {
      // 1. Criar tokens para diferentes tipos de usuários
      const adminToken = JWTUtils.generate({
        payload: {
          id: 'admin123',
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const userToken = JWTUtils.generate({
        payload: {
          id: 'user456',
          role: 'user',
          permissions: ['read', 'write']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const guestToken = JWTUtils.generate({
        payload: {
          id: 'guest789',
          role: 'guest',
          permissions: ['read']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      // 2. Função simulada de verificação de autorização
      const checkAuthorization = (token: string, requiredPermission: string): boolean => {
        try {
          const decoded = JWTUtils.verify({ token, secretKey }) as any;
          return decoded.permissions && decoded.permissions.includes(requiredPermission);
        } catch {
          return false;
        }
      };
      
      // 3. Verificar permissões para diferentes usuários
      
      // Admin deve ter todas as permissões
      expect(checkAuthorization(adminToken, 'read')).toBe(true);
      expect(checkAuthorization(adminToken, 'write')).toBe(true);
      expect(checkAuthorization(adminToken, 'delete')).toBe(true);
      expect(checkAuthorization(adminToken, 'admin')).toBe(true);
      
      // Usuário regular deve ter permissões limitadas
      expect(checkAuthorization(userToken, 'read')).toBe(true);
      expect(checkAuthorization(userToken, 'write')).toBe(true);
      expect(checkAuthorization(userToken, 'delete')).toBe(false);
      expect(checkAuthorization(userToken, 'admin')).toBe(false);
      
      // Convidado deve ter permissões mínimas
      expect(checkAuthorization(guestToken, 'read')).toBe(true);
      expect(checkAuthorization(guestToken, 'write')).toBe(false);
      expect(checkAuthorization(guestToken, 'delete')).toBe(false);
      expect(checkAuthorization(guestToken, 'admin')).toBe(false);
    });

    it('deve simular um cenário de token expirado e renovação', () => {
      // 1. Criar um token que já expirou (no passado)
      const userData = {
        id: 'user123',
        username: 'quickexpire'
      };
      
      const pastTime = Math.floor(Date.now() / 1000) - 10; // 10 segundos no passado
      const expiredToken = JWTUtils.generate({
        payload: { ...userData, exp: pastTime },
        secretKey
      });
      
      // 2. Verificar que o token está expirado
      const isExpired = JWTUtils.isExpired({ token: expiredToken });
      expect(isExpired).toBe(true);
      
      // 3. Tentar verificar o token (deve falhar)
      expect(() => {
        JWTUtils.verify({ token: expiredToken, secretKey });
      }).toThrow();
      
      // 4. Renovar o token
      const refreshedToken = JWTUtils.refresh({
        token: expiredToken,
        secretKey,
        options: { expiresIn: '10s' }
      });
      
      // 5. Verificar que o novo token é válido
      const decoded = JWTUtils.verify({
        token: refreshedToken,
        secretKey
      }) as any;
      
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      
      // 6. Verificar que o novo token não está expirado
      const newIsExpired = JWTUtils.isExpired({ token: refreshedToken });
      expect(newIsExpired).toBe(false);
    });
  });
});