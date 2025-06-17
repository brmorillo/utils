import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Testes unitários para a classe JWTUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('JWTUtils - Testes Unitários', () => {
  const secretKey = 'test-secret-key-for-jwt-utils';
  const payload = { userId: '123', role: 'admin' };

  describe('generate', () => {
    it('deve gerar um token JWT válido', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      // Verifica se é uma string
      expect(typeof token).toBe('string');
      
      // Verifica se tem o formato correto de JWT (três partes separadas por ponto)
      expect(token.split('.')).toHaveLength(3);
      
      // Verifica se pode ser decodificado
      const decoded = JWTUtils.decode({ token });
      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('deve gerar um token com expiração quando especificado', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const decoded = JWTUtils.decode({ token }) as any;
      expect(decoded).toHaveProperty('exp');
      expect(typeof decoded.exp).toBe('number');
    });

    it('deve lançar erro para payload inválido', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        JWTUtils.generate({ payload: null, secretKey });
      }).toThrow('Invalid payload');
    });

    it('deve lançar erro para secretKey inválida', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        JWTUtils.generate({ payload, secretKey: '' });
      }).toThrow('Invalid secretKey');
    });
  });

  describe('verify', () => {
    it('deve verificar um token JWT válido', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.verify({
        token,
        secretKey,
      });

      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('deve lançar erro para token inválido', () => {
      expect(() => {
        JWTUtils.verify({
          token: 'invalid-token',
          secretKey,
        });
      }).toThrow();
    });

    it('deve lançar erro para secretKey incorreta', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.verify({
          token,
          secretKey: 'wrong-secret-key',
        });
      }).toThrow();
    });
  });

  describe('decode', () => {
    it('deve decodificar um token JWT sem verificar a assinatura', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.decode({ token });
      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('deve retornar o header e payload quando complete=true', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.decode({ token, complete: true }) as any;
      expect(decoded).toHaveProperty('header');
      expect(decoded).toHaveProperty('payload');
      expect(decoded.payload).toHaveProperty('userId', '123');
      expect(decoded.header).toHaveProperty('alg');
    });

    it('deve lançar erro para token inválido', () => {
      expect(() => {
        JWTUtils.decode({ token: 'not-a-jwt-token' });
      }).toThrow();
    });
  });

  describe('refresh', () => {
    it('deve renovar um token expirado', () => {
      // Cria um token que expira em 1 segundo
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' },
      });

      // Espera o token expirar
      return new Promise<void>(resolve => {
        setTimeout(() => {
          // Renova o token
          const newToken = JWTUtils.refresh({
            token,
            secretKey,
            options: { expiresIn: '1h' },
          });

          // Verifica se o novo token é diferente do antigo
          expect(newToken).not.toBe(token);

          // Verifica se o novo token pode ser verificado
          const decoded = JWTUtils.verify({
            token: newToken,
            secretKey,
          }) as any;

          // Verifica se o payload foi preservado
          expect(decoded).toHaveProperty('userId', '123');
          expect(decoded).toHaveProperty('role', 'admin');

          resolve();
        }, 1100);
      });
    });

    it('deve lançar erro para token inválido', () => {
      expect(() => {
        JWTUtils.refresh({
          token: 'invalid-token',
          secretKey,
        });
      }).toThrow();
    });
  });

  describe('isExpired', () => {
    it('deve retornar false para token não expirado', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const isExpired = JWTUtils.isExpired({ token });
      expect(isExpired).toBe(false);
    });

    it('deve retornar true para token expirado', () => {
      // Cria um token que expira em 1 segundo
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' },
      });

      // Espera o token expirar
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const isExpired = JWTUtils.isExpired({ token });
          expect(isExpired).toBe(true);
          resolve();
        }, 1100);
      });
    });

    it('deve lançar erro para token sem expiração', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.isExpired({ token });
      }).toThrow('missing expiration claim');
    });
  });

  describe('getExpirationTime', () => {
    it('deve retornar o tempo restante em segundos', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const remainingTime = JWTUtils.getExpirationTime({ token });
      
      // O tempo restante deve ser próximo de 3600 segundos (1 hora)
      // Usamos uma margem de erro de 10 segundos para o teste
      expect(remainingTime).toBeGreaterThan(3590);
      expect(remainingTime).toBeLessThanOrEqual(3600);
    });

    it('deve retornar 0 para token expirado', () => {
      // Cria um token que expira em 1 segundo
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' },
      });

      // Espera o token expirar
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const remainingTime = JWTUtils.getExpirationTime({ token });
          expect(remainingTime).toBe(0);
          resolve();
        }, 1100);
      });
    });

    it('deve lançar erro para token sem expiração', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.getExpirationTime({ token });
      }).toThrow('missing expiration claim');
    });
  });
});