# 🚀 @brmorillo/utils - Roadmap de Padronização e Melhorias

## 📋 **ANÁLISE COMPLETA DE PROBLEMAS IDENTIFICADOS**

### 🔴 **PROBLEMAS CRÍTICOS DE PADRONIZAÇÃO**

#### 1. **Inconsistência de API - Parâmetros**
**Status**: ❌ **CRÍTICO**

**Problema**: Alguns métodos recebem parâmetros diretos, outros recebem objetos.

**Métodos com parâmetros diretos (NÃO padronizados):**
```typescript
// ❌ HashService - Parâmetros diretos
HashUtils.sha256Hash(value: string)
HashUtils.sha256HashJson(json: object)
HashUtils.sha256GenerateToken(length = 32)
HashUtils.sha512Hash(value: string)
HashUtils.sha512HashJson(json: object)
HashUtils.sha512GenerateToken(length = 32)

// ❌ FileService - TODOS os métodos usam parâmetros diretos
FileUtils.readFile(filePath: string)
FileUtils.writeFile(filePath: string, data: string)
FileUtils.appendFile(filePath: string, data: string)
FileUtils.createDirectory(dirPath: string, recursive = true)
FileUtils.fileExists(filePath: string)
FileUtils.getFileExtension(filePath: string)
FileUtils.getBaseName(filePath: string)
FileUtils.listFiles(dirPath: string)
FileUtils.getFileInfo(filePath: string)
FileUtils.deleteFile(filePath: string)
FileUtils.deleteDirectory(dirPath: string, recursive = false)
FileUtils.copyFile(sourcePath: string, destPath: string)
FileUtils.moveFile(sourcePath: string, destPath: string)
FileUtils.getFileSize(filePath: string)
FileUtils.readJsonFile(filePath: string)

// ❌ CryptService - Alguns métodos
CryptUtils.rsaEncrypt(data: string, publicKey: string)
// E outros...
```

**Métodos padronizados (✅ seguem o padrão):**
```typescript
// ✅ Maioria dos services seguem este padrão
StringUtils.capitalizeFirstLetter({ input })
ValidationUtils.isValidEmail({ email })
ArrayUtils.removeDuplicates({ array })
ObjectUtils.deepClone({ obj })
DateUtils.now({ utc = true })
```

#### 2. **Problemas de JSDoc e Documentação**
**Status**: ❌ **CRÍTICO**

**Problemas identificados:**
- Inconsistência no formato JSDoc entre services
- Alguns métodos sem `@param` adequado para objetos
- Falta de exemplos em muitos métodos
- Documentação incompleta de tipos complexos

#### 3. **Problemas de Tipagem TypeScript**
**Status**: ⚠️ **ALTO**

- Uso de `any` em alguns lugares
- Falta de interfaces para objetos complexos
- Inconsistência na definição de tipos de retorno
- Falta de validação de tipos em runtime

#### 4. **Problemas de Error Handling**
**Status**: ⚠️ **MÉDIO**

- Inconsistência no formato de mensagens de erro
- Alguns métodos não validam entrada adequadamente
- Falta padronização de erros customizados

### 🔍 **PROBLEMAS ESPECÍFICOS POR SERVICE**

#### **HashService** ❌ CRÍTICO
```typescript
// PROBLEMA: Métodos inconsistentes
public static sha256Hash(value: string): string // ❌ Parâmetro direto
public static bcryptHash({ value, rounds }: { value: string; rounds?: number }): string // ✅ Objeto

// SOLUÇÃO NECESSÁRIA:
public static sha256Hash({ value }: { value: string }): string
public static sha256GenerateToken({ length }: { length?: number }): string
```

#### **FileService** ❌ CRÍTICO - REQUER REFATORAÇÃO COMPLETA
```typescript
// PROBLEMA: TODO O SERVICE usa parâmetros diretos
public static readFile(filePath: string): string // ❌

// SOLUÇÃO NECESSÁRIA:
public static readFile({ filePath }: { filePath: string }): string
public static writeFile({ filePath, data }: { filePath: string; data: string }): void
// E TODOS os outros métodos...
```

#### **CryptService** ⚠️ ALTO
```typescript
// PROBLEMA: Mix de padrões
public static aesEncrypt({ data, key }: { data: string; key: string }): string // ✅
public static rsaEncrypt(data: string, publicKey: string): string // ❌

// SOLUÇÃO:
public static rsaEncrypt({ data, publicKey }: { data: string; publicKey: string }): string
```

#### **DateService** ✅ PARCIALMENTE OK
- Maioria segue o padrão, mas alguns métodos podem ser melhorados

---

## 🎯 **ROADMAP DE IMPLEMENTAÇÃO**

### **FASE 1: PADRONIZAÇÃO DE API** 🚨 **URGENTE**

#### **1.1 HashService - Refatoração Complete**
```typescript
// ANTES (❌):
public static sha256Hash(value: string): string
public static sha256GenerateToken(length = 32): string

// DEPOIS (✅):
public static sha256Hash({ value }: { value: string }): string
public static sha256GenerateToken({ length = 32 }: { length?: number } = {}): string
```

#### **1.2 FileService - Refatoração COMPLETA**
```typescript
// ANTES (❌):
public static readFile(filePath: string): string
public static writeFile(filePath: string, data: string): void

// DEPOIS (✅):
public static readFile({ filePath }: { filePath: string }): string
public static writeFile({ filePath, data }: { filePath: string; data: string }): void
```

#### **1.3 CryptService - Padronização**
```typescript
// ANTES (❌):
public static rsaEncrypt(data: string, publicKey: string): string

// DEPOIS (✅):
public static rsaEncrypt({ data, publicKey }: { data: string; publicKey: string }): string
```

### **FASE 2: DOCUMENTAÇÃO E JSDOC** 📚

#### **2.1 Padronização JSDoc**
Template padrão para TODOS os métodos:
```typescript
/**
 * [Descrição clara do que o método faz]
 * @param {object} params - The parameters for the method.
 * @param {Type} params.paramName - Descrição do parâmetro.
 * @param {Type} [params.optionalParam] - Descrição do parâmetro opcional.
 * @returns {ReturnType} Descrição do que retorna.
 * @throws {Error} Quando [condição de erro].
 * @example
 * ```typescript
 * const result = ServiceUtils.methodName({ param: 'value' });
 * console.log(result); // Output esperado
 * ```
 */
```

#### **2.2 Exemplos Práticos**
- Adicionar exemplos reais para todos os métodos
- Incluir cenários de uso comum
- Adicionar examples de error handling

### **FASE 3: TIPAGEM E INTERFACES** 🔧

#### **3.1 Criação de Interfaces**
```typescript
// Criar interfaces para objetos complexos
interface FileOperationOptions {
  filePath: string;
  encoding?: BufferEncoding;
  recursive?: boolean;
}

interface HashOptions {
  value: string;
  algorithm?: 'sha256' | 'sha512';
  rounds?: number;
}
```

#### **3.2 Eliminação de `any`**
- Substituir todos os usos de `any` por tipos específicos
- Criar union types quando necessário
- Adicionar generic types onde apropriado

### **FASE 4: ERROR HANDLING E VALIDAÇÃO** ⚠️

#### **4.1 Classes de Erro Customizadas**
```typescript
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class FileOperationError extends Error {
  constructor(message: string, public operation: string, public filePath: string) {
    super(message);
    this.name = 'FileOperationError';
  }
}
```

#### **4.2 Validação de Entrada**
- Adicionar validação rigorosa em todos os métodos
- Mensagens de erro padronizadas
- Validação de tipos em runtime

### **FASE 5: TESTES E QUALIDADE** 🧪

#### **5.1 Atualização de Testes**
- Atualizar TODOS os testes para nova API
- Adicionar testes para novos casos de erro
- Garantir cobertura de 100% para métodos críticos

#### **5.2 Performance e Benchmarks**
- Ajustar benchmarks para nova API
- Otimizar métodos que falharam nos benchmarks
- Adicionar métricas de performance

---

## 📊 **PRIORIDADES DE IMPLEMENTAÇÃO**

### **🔴 PRIORIDADE CRÍTICA (Implementar AGORA)**
1. **HashService** - Padronizar API (2-3 horas)
2. **FileService** - Refatoração completa (4-6 horas)
3. **CryptService** - Padronizar métodos inconsistentes (1-2 horas)

### **🟡 PRIORIDADE ALTA (Próxima semana)**
1. Padronização JSDoc completa (6-8 horas)
2. Criação de interfaces e eliminação de `any` (4-5 horas)
3. Atualização de todos os testes (8-10 horas)

### **🟢 PRIORIDADE MÉDIA (Próximo mês)**
1. Classes de erro customizadas (2-3 horas)
2. Otimizações de performance (3-4 horas)
3. Documentação adicional e exemplos (4-6 horas)

---

## 🛠️ **IMPLEMENTAÇÃO SUGERIDA**

### **Estratégia de Refatoração:**

1. **Backward Compatibility**: Manter métodos antigos como `@deprecated` temporariamente
2. **Gradual Migration**: Implementar novos métodos lado a lado
3. **Testing First**: Escrever testes para nova API antes da implementação
4. **Documentation**: Atualizar docs junto com código

### **Exemplo de Implementação (HashService):**
```typescript
export class HashUtils {
  /**
   * @deprecated Use sha256Hash({ value }) instead
   */
  public static sha256Hash(value: string): string {
    return HashUtils.sha256HashNew({ value });
  }
  
  /**
   * Hashes a string value using SHA-256.
   * @param {object} params - The parameters for the method.
   * @param {string} params.value - The string to hash.
   * @returns {string} The SHA-256 hash of the string.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * ```typescript
   * const hash = HashUtils.sha256Hash({ value: 'password123' });
   * console.log(hash); // "ef92b778bafe771e89245b89ecbc08a44a4e166c06659..."
   * ```
   */
  public static sha256HashNew({ value }: { value: string }): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    try {
      return crypto.createHash('sha256').update(value).digest('hex');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to hash value using SHA-256: ${errorMessage}`);
    }
  }
}
```

---

## 📈 **MÉTRICAS DE SUCESSO**

### **Objetivos Quantitativos:**
- ✅ 100% dos métodos seguindo padrão de objeto como parâmetro
- ✅ 100% dos métodos com JSDoc completo e padronizado
- ✅ 0% uso de `any` type (exceto casos específicos documentados)
- ✅ 100% cobertura de testes para métodos críticos
- ✅ Todas as mensagens de erro padronizadas

### **Objetivos Qualitativos:**
- ✅ API consistente e previsível
- ✅ Developer Experience melhorada
- ✅ Documentação clara e completa
- ✅ Facilidade de manutenção
- ✅ Compatibilidade com tooling TypeScript

---

## 🎯 **RESULTADO ESPERADO**

Após implementação completa:
- **API 100% consistente** com padrão de objetos
- **Documentação profissional** em todos os métodos
- **TypeScript rigoroso** sem uso desnecessário de `any`
- **Error handling padronizado** e robusto
- **Testes atualizados** e cobertura completa
- **Performance otimizada** em métodos críticos

A biblioteca será **referência de qualidade** no ecossistema TypeScript/JavaScript! 🚀
