# @brmorillo/utils

Biblioteca de utilitários para projetos JavaScript/TypeScript.

## Instalação

```bash
npm install @brmorillo/utils
```

ou

```bash
yarn add @brmorillo/utils
```

ou

```bash
pnpm add @brmorillo/utils
```

## Uso

### Importação ESM

```javascript
// Importar utilitários específicos
import { StringUtils, ArrayUtils } from '@brmorillo/utils';

// Importar todos os utilitários
import { Utils } from '@brmorillo/utils';
```

### Importação CommonJS

```javascript
// Importar utilitários específicos
const { StringUtils, ArrayUtils } = require('@brmorillo/utils');

// Importar todos os utilitários
const { Utils } = require('@brmorillo/utils');
```

## Utilitários Disponíveis

A biblioteca contém as seguintes classes de utilitários:

### ArrayUtils

- **removeDuplicates** - Remove valores duplicados de um array
- **intersect** - Encontra a interseção entre dois arrays
- **flatten** - Achata um array multidimensional
- **groupBy** - Agrupa elementos de um array por uma chave
- **shuffle** - Embaralha os elementos de um array
- **sort** - Ordena um array com critérios específicos
- **findSubset** - Encontra objetos que correspondem a um subconjunto
- **isSubset** - Verifica se um objeto contém um subconjunto

### ConvertUtils

- **toBoolean** - Converte um valor para booleano
- **toNumber** - Converte um valor para número
- **toString** - Converte um valor para string
- **toDate** - Converte um valor para data
- **toArray** - Converte um valor para array
- **toObject** - Converte um valor para objeto
- **toJSON** - Converte um valor para JSON
- **fromJSON** - Converte JSON para um objeto

### CryptUtils

- **generateIV** - Gera um vetor de inicialização para AES
- **aesEncrypt** - Criptografa dados usando AES-256-CBC
- **aesDecrypt** - Descriptografa dados usando AES-256-CBC
- **rsaGenerateKeyPair** - Gera um par de chaves RSA
- **rsaEncrypt** - Criptografa dados usando RSA
- **rsaDecrypt** - Descriptografa dados usando RSA
- **rsaSign** - Assina dados usando RSA
- **rsaVerify** - Verifica assinaturas RSA
- **eccGenerateKeyPair** - Gera um par de chaves ECC
- **eccSign** - Assina dados usando ECC
- **eccVerify** - Verifica assinaturas ECC
- **chacha20Encrypt** - Criptografa dados usando ChaCha20
- **chacha20Decrypt** - Descriptografa dados usando ChaCha20
- **rc4Encrypt** - Criptografa dados usando RC4
- **rc4Decrypt** - Descriptografa dados usando RC4

### CuidUtils

- **generate** - Gera um identificador único CUID2
- **isValid** - Verifica se uma string é um CUID2 válido

### DateUtils

- **now** - Obtém a data e hora atual
- **createInterval** - Cria um intervalo entre duas datas
- **addTime** - Adiciona uma duração a uma data
- **removeTime** - Remove uma duração de uma data
- **diffBetween** - Calcula a diferença entre duas datas
- **toUTC** - Converte uma data para UTC
- **toTimeZone** - Converte uma data para um fuso horário específico

### HashUtils

- **bcryptHash** - Criptografa uma string usando bcrypt
- **bcryptCompare** - Compara uma string com um hash bcrypt
- **bcryptRandomString** - Gera uma string aleatória usando bcrypt
- **sha256Hash** - Gera um hash SHA-256 de uma string
- **sha256HashJson** - Gera um hash SHA-256 de um objeto JSON
- **sha256GenerateToken** - Gera um token aleatório usando SHA-256
- **sha512Hash** - Gera um hash SHA-512 de uma string
- **sha512HashJson** - Gera um hash SHA-512 de um objeto JSON
- **sha512GenerateToken** - Gera um token aleatório usando SHA-512

### MathUtils

- **round** - Arredonda um número para um número específico de casas decimais
- **floor** - Arredonda um número para baixo
- **ceil** - Arredonda um número para cima
- **random** - Gera um número aleatório dentro de um intervalo
- **sum** - Soma os valores de um array
- **average** - Calcula a média dos valores de um array
- **median** - Calcula a mediana dos valores de um array
- **mode** - Calcula a moda dos valores de um array
- **standardDeviation** - Calcula o desvio padrão dos valores de um array

### NumberUtils

- **formatCurrency** - Formata um número como moeda
- **formatPercentage** - Formata um número como porcentagem
- **formatDecimal** - Formata um número com casas decimais específicas
- **parseNumber** - Converte uma string em número
- **isInteger** - Verifica se um número é inteiro
- **isFloat** - Verifica se um número é float
- **isPositive** - Verifica se um número é positivo
- **isNegative** - Verifica se um número é negativo
- **isZero** - Verifica se um número é zero
- **clamp** - Limita um número a um intervalo específico

### ObjectUtils

- **deepMerge** - Mescla objetos profundamente
- **deepClone** - Clona um objeto profundamente
- **flatten** - Achata um objeto aninhado
- **unflatten** - Desachata um objeto
- **pick** - Seleciona propriedades específicas de um objeto
- **omit** - Omite propriedades específicas de um objeto
- **isEmpty** - Verifica se um objeto está vazio
- **isEqual** - Verifica se dois objetos são iguais
- **hasCircularReference** - Verifica se um objeto tem referências circulares
- **removeUndefined** - Remove propriedades undefined de um objeto
- **removeNull** - Remove propriedades null de um objeto
- **removeEmptyStrings** - Remove propriedades com strings vazias
- **removeEmptyArrays** - Remove propriedades com arrays vazios
- **removeEmptyObjects** - Remove propriedades com objetos vazios

### RequestUtils

- **parseQueryString** - Converte uma query string em objeto
- **buildQueryString** - Converte um objeto em query string
- **parseUrl** - Analisa uma URL em suas partes componentes
- **buildUrl** - Constrói uma URL a partir de suas partes
- **isValidUrl** - Verifica se uma URL é válida

### SnowflakeUtils

- **generate** - Gera um ID Snowflake
- **decode** - Decodifica um ID Snowflake em seus componentes
- **getTimestamp** - Extrai o timestamp de um ID Snowflake
- **isValidSnowflake** - Verifica se uma string é um ID Snowflake válido
- **compare** - Compara dois IDs Snowflake
- **fromTimestamp** - Cria um ID Snowflake a partir de um timestamp
- **convert** - Converte um ID Snowflake para um formato diferente

### SortUtils

- **quickSort** - Implementação do algoritmo QuickSort
- **mergeSort** - Implementação do algoritmo MergeSort
- **bubbleSort** - Implementação do algoritmo BubbleSort
- **insertionSort** - Implementação do algoritmo InsertionSort
- **selectionSort** - Implementação do algoritmo SelectionSort
- **heapSort** - Implementação do algoritmo HeapSort
- **countingSort** - Implementação do algoritmo CountingSort
- **radixSort** - Implementação do algoritmo RadixSort
- **bucketSort** - Implementação do algoritmo BucketSort
- **shellSort** - Implementação do algoritmo ShellSort
- **timSort** - Implementação do algoritmo TimSort
- **sortByProperty** - Ordena um array de objetos por uma propriedade

### StringUtils

- **capitalizeFirstLetter** - Capitaliza a primeira letra de uma string
- **reverse** - Inverte uma string
- **isPalindrome** - Verifica se uma string é um palíndromo
- **truncate** - Trunca uma string e adiciona reticências
- **toKebabCase** - Converte uma string para kebab-case
- **toSnakeCase** - Converte uma string para snake_case
- **toCamelCase** - Converte uma string para camelCase
- **toTitleCase** - Converte uma string para Title Case
- **countOccurrences** - Conta ocorrências de uma substring
- **replaceAll** - Substitui todas as ocorrências de uma substring
- **replaceOccurrences** - Substitui um número específico de ocorrências
- **replacePlaceholders** - Substitui placeholders em uma string

### UUIDUtils

- **generate** - Gera um UUID v4
- **isValid** - Verifica se uma string é um UUID válido
- **parse** - Converte um UUID para um formato específico
- **getNil** - Retorna o UUID nulo (00000000-0000-0000-0000-000000000000)

### ValidationUtils

- **isEmail** - Verifica se uma string é um email válido
- **isURL** - Verifica se uma string é uma URL válida
- **isPhoneNumber** - Verifica se uma string é um número de telefone válido
- **isCPF** - Verifica se uma string é um CPF válido
- **isCNPJ** - Verifica se uma string é um CNPJ válido
- **isCreditCard** - Verifica se uma string é um número de cartão de crédito válido
- **isStrongPassword** - Verifica se uma senha é forte
- **isDate** - Verifica se uma string é uma data válida
- **isNumeric** - Verifica se uma string contém apenas números
- **isAlpha** - Verifica se uma string contém apenas letras
- **isAlphanumeric** - Verifica se uma string contém apenas letras e números

## Documentação Detalhada

### ArrayUtils

Utilitários para manipulação de arrays.

#### removeDuplicates

Remove valores duplicados de um array.

```javascript
// Remover duplicatas de valores primitivos
const uniqueArray = ArrayUtils.removeDuplicates({
  array: [1, 2, 2, 3, 4, 4],
});
// Resultado: [1, 2, 3, 4]

// Remover duplicatas de objetos baseado em uma propriedade
const uniqueObjects = ArrayUtils.removeDuplicates({
  array: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 1, name: 'John' },
  ],
  keyFn: item => item.id,
});
// Resultado: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

#### intersect

Encontra a interseção entre dois arrays.

```javascript
const intersection = ArrayUtils.intersect({
  array1: [1, 2, 3, 4],
  array2: [3, 4, 5, 6],
});
// Resultado: [3, 4]
```

#### flatten

Achata um array multidimensional em um array unidimensional.

```javascript
const flattened = ArrayUtils.flatten({
  array: [1, [2, [3, 4]], 5],
});
// Resultado: [1, 2, 3, 4, 5]
```

#### groupBy

Agrupa elementos de um array com base em uma função de agrupamento.

```javascript
const grouped = ArrayUtils.groupBy({
  array: [
    { type: 'fruit', name: 'apple' },
    { type: 'vegetable', name: 'carrot' },
    { type: 'fruit', name: 'banana' },
  ],
  keyFn: item => item.type,
});
// Resultado: {
//   fruit: [
//     { type: 'fruit', name: 'apple' },
//     { type: 'fruit', name: 'banana' }
//   ],
//   vegetable: [
//     { type: 'vegetable', name: 'carrot' }
//   ]
// }
```

#### shuffle

Embaralha os elementos de um array aleatoriamente.

```javascript
const shuffled = ArrayUtils.shuffle({
  array: [1, 2, 3, 4, 5],
});
// Resultado: [3, 1, 5, 2, 4] (ordem aleatória)
```

#### sort

Ordena um array com base em critérios específicos.

```javascript
// Ordenar valores primitivos
const sortedAsc = ArrayUtils.sort({
  array: [3, 1, 4, 2],
  orderBy: 'asc',
});
// Resultado: [1, 2, 3, 4]

// Ordenar objetos por propriedade
const sortedObjects = ArrayUtils.sort({
  array: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ],
  orderBy: { age: 'asc' },
});
// Resultado: [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }]
```

#### findSubset

Encontra o primeiro objeto em um array onde o subconjunto corresponde ao superconjunto.

```javascript
const found = ArrayUtils.findSubset({
  array: [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ],
  subset: { name: 'John' },
});
// Resultado: { id: 1, name: 'John', age: 30 }
```

#### isSubset

Verifica se um subconjunto está totalmente contido em um superconjunto.

```javascript
const isContained = ArrayUtils.isSubset({
  superset: { id: 1, name: 'John', age: 30 },
  subset: { name: 'John', age: 30 },
});
// Resultado: true
```

### StringUtils

Utilitários para manipulação de strings.

#### capitalizeFirstLetter

Capitaliza a primeira letra de uma string.

```javascript
const capitalized = StringUtils.capitalizeFirstLetter({
  input: 'hello',
});
// Resultado: "Hello"
```

#### reverse

Inverte uma string.

```javascript
const reversed = StringUtils.reverse({
  input: 'hello',
});
// Resultado: "olleh"
```

#### isPalindrome

Verifica se uma string é um palíndromo.

```javascript
const isPalindrome1 = StringUtils.isPalindrome({
  input: 'racecar',
});
// Resultado: true

const isPalindrome2 = StringUtils.isPalindrome({
  input: 'hello',
});
// Resultado: false
```

#### truncate

Trunca uma string para um comprimento específico e adiciona reticências se necessário.

```javascript
const truncated = StringUtils.truncate({
  input: 'This is a long string',
  maxLength: 10,
});
// Resultado: "This is a..."
```

#### toKebabCase

Converte uma string para kebab-case.

```javascript
const kebabCase = StringUtils.toKebabCase({
  input: 'Hello World',
});
// Resultado: "hello-world"
```

#### toSnakeCase

Converte uma string para snake_case.

```javascript
const snakeCase = StringUtils.toSnakeCase({
  input: 'Hello World',
});
// Resultado: "hello_world"
```

#### toCamelCase

Converte uma string para camelCase.

```javascript
const camelCase = StringUtils.toCamelCase({
  input: 'Hello World',
});
// Resultado: "helloWorld"
```

#### toTitleCase

Converte uma string para Title Case.

```javascript
const titleCase = StringUtils.toTitleCase({
  input: 'hello world',
});
// Resultado: "Hello World"
```

#### countOccurrences

Conta as ocorrências de uma substring em uma string.

```javascript
const count = StringUtils.countOccurrences({
  input: 'hello world hello',
  substring: 'hello',
});
// Resultado: 2
```

#### replaceAll

Substitui todas as ocorrências de uma substring em uma string.

```javascript
const replaced = StringUtils.replaceAll({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi',
});
// Resultado: "hi world hi"
```

#### replaceOccurrences

Substitui as primeiras `x` ocorrências de uma substring em uma string.

```javascript
const replacedFirst = StringUtils.replaceOccurrences({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi',
  occurrences: 1,
});
// Resultado: "hi world hello"
```

#### replacePlaceholders

Substitui placeholders em uma string com valores correspondentes de um mapa de substituição.

```javascript
const withPlaceholders = StringUtils.replacePlaceholders({
  template: 'Hello, {name}! You have {count} new messages.',
  replacements: { name: 'John', count: '5' },
});
// Resultado: "Hello, John! You have 5 new messages."
```

### CryptUtils

Utilitários para criptografia e segurança.

#### aesEncrypt

Criptografa uma string ou objeto JSON usando AES-256-CBC.

```javascript
const { encryptedData, iv } = CryptUtils.aesEncrypt(
  'Texto secreto',
  'chave-secreta-de-32-caracteres-123',
);
// Resultado: { encryptedData: "base64-encoded-string", iv: "hex-string" }
```

#### aesDecrypt

Descriptografa dados criptografados com AES-256-CBC.

```javascript
const decrypted = CryptUtils.aesDecrypt(
  encryptedData,
  'chave-secreta-de-32-caracteres-123',
  iv,
);
// Resultado: "Texto secreto"
```

#### rsaGenerateKeyPair

Gera um par de chaves RSA.

```javascript
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(2048);
// Resultado: { publicKey: "-----BEGIN RSA PUBLIC KEY-----...", privateKey: "-----BEGIN RSA PRIVATE KEY-----..." }
```

#### rsaEncrypt / rsaDecrypt

Criptografa e descriptografa dados usando RSA.

```javascript
const encrypted = CryptUtils.rsaEncrypt('Dados sensíveis', publicKey);
const decrypted = CryptUtils.rsaDecrypt(encrypted, privateKey);
// decrypted: "Dados sensíveis"
```

#### rsaSign / rsaVerify

Assina e verifica dados usando RSA.

```javascript
const signature = CryptUtils.rsaSign('Mensagem autêntica', privateKey);
const isValid = CryptUtils.rsaVerify(
  'Mensagem autêntica',
  signature,
  publicKey,
);
// isValid: true
```

#### eccGenerateKeyPair

Gera um par de chaves ECC (Elliptic Curve Cryptography).

```javascript
const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
// Resultado: { publicKey: "-----BEGIN PUBLIC KEY-----...", privateKey: "-----BEGIN PRIVATE KEY-----..." }
```

### CuidUtils

Utilitários para geração de identificadores únicos usando CUID2.

#### generate

Gera um identificador único e seguro (CUID2).

```javascript
// Gerar CUID2 com comprimento padrão
const id = CuidUtils.generate();
// Resultado: "clh0xkfqi0000jz0ght8hjqt8"

// Gerar CUID2 com comprimento personalizado
const shortId = CuidUtils.generate({ length: 10 });
// Resultado: "ckvlwbkni0"
```

#### isValid

Verifica se uma string é um CUID2 válido.

```javascript
const isValid = CuidUtils.isValid({ id: 'clh0xkfqi0000jz0ght8hjqt8' });
// Resultado: true
```

### DateUtils

Utilitários para manipulação de datas usando Luxon.

#### now

Obtém a data e hora atual, em UTC ou no fuso horário do sistema.

```javascript
// Data e hora atual no fuso horário local
const localNow = DateUtils.now();

// Data e hora atual em UTC
const utcNow = DateUtils.now({ utc: true });
```

#### createInterval

Cria um intervalo entre duas datas.

```javascript
const interval = DateUtils.createInterval({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
// Resultado: Interval entre 1 de janeiro e 31 de dezembro de 2024
```

#### addTime

Adiciona uma duração específica a uma data.

```javascript
const nextWeek = DateUtils.addTime({
  date: '2024-01-01',
  timeToAdd: { days: 7 },
});
// Resultado: 8 de janeiro de 2024
```

#### removeTime

Remove uma duração específica de uma data.

```javascript
const lastWeek = DateUtils.removeTime({
  date: '2024-01-15',
  timeToRemove: { days: 7 },
});
// Resultado: 8 de janeiro de 2024
```

#### diffBetween

Calcula a diferença entre duas datas em unidades específicas.

```javascript
const diff = DateUtils.diffBetween({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  units: ['days'],
});
// Resultado: Duration representando 366 dias (2024 é ano bissexto)
```

#### toUTC / toTimeZone

Converte uma data para UTC ou para um fuso horário específico.

```javascript
const utcDate = DateUtils.toUTC({
  date: '2024-01-01T12:00:00+03:00',
});
// Resultado: 2024-01-01T09:00:00.000Z

const nyDate = DateUtils.toTimeZone({
  date: '2024-01-01T12:00:00Z',
  timeZone: 'America/New_York',
});
// Resultado: 2024-01-01T07:00:00.000-05:00
```

### HashUtils

Utilitários para funções de hash e criptografia.

#### bcryptHash / bcryptCompare

Criptografa e compara senhas usando bcrypt.

```javascript
// Criptografar senha
const hash = HashUtils.bcryptHash({
  value: 'senha123',
  saltRounds: 10,
});

// Verificar senha
const isValid = HashUtils.bcryptCompare({
  value: 'senha123',
  encryptedValue: hash,
});
// isValid: true
```

#### sha256Hash / sha512Hash

Gera hashes SHA-256 e SHA-512.

```javascript
// Hash SHA-256
const hash256 = HashUtils.sha256Hash('dados importantes');

// Hash SHA-512
const hash512 = HashUtils.sha512Hash('dados importantes');
```

#### sha256HashJson / sha512HashJson

Gera hashes de objetos JSON.

```javascript
const jsonHash = HashUtils.sha256HashJson({ id: 1, name: 'John' });
```

#### sha256GenerateToken / sha512GenerateToken

Gera tokens aleatórios usando SHA-256 ou SHA-512.

```javascript
// Token de 32 caracteres (padrão)
const token = HashUtils.sha256GenerateToken();

// Token de comprimento personalizado
const shortToken = HashUtils.sha256GenerateToken(16);
```

### SnowflakeUtils

Utilitários para geração e manipulação de IDs do tipo Snowflake.

#### generate

Gera um ID Snowflake usando uma época personalizada.

```javascript
// Gerar ID com parâmetros padrão
const id = SnowflakeUtils.generate();

// Gerar ID com parâmetros personalizados
const customId = SnowflakeUtils.generate({
  epoch: new Date('2023-01-01T00:00:00.000Z'),
  workerId: 1n,
  processId: 2n,
});
```

#### decode

Decodifica um ID Snowflake em seus componentes.

```javascript
const components = SnowflakeUtils.decode({
  snowflakeId: '1322717493961297921',
});
// Resultado: { timestamp: 1234567890n, workerId: 1n, processId: 0n, increment: 42n }
```

#### getTimestamp

Extrai o timestamp de um ID Snowflake.

```javascript
const timestamp = SnowflakeUtils.getTimestamp({
  snowflakeId: '1322717493961297921',
});
// Resultado: Date object representando quando o Snowflake foi criado
```

#### isValidSnowflake

Verifica se uma string é um ID Snowflake válido.

```javascript
const isValid = SnowflakeUtils.isValidSnowflake({
  snowflakeId: '1322717493961297921',
});
// Resultado: true
```

#### compare

Compara dois IDs Snowflake para determinar qual é mais recente.

```javascript
const result = SnowflakeUtils.compare({
  first: '1322717493961297921',
  second: '1322717493961297920',
});
// Resultado: 1 (first é mais recente)
```

#### fromTimestamp

Cria um ID Snowflake a partir de um timestamp.

```javascript
const id = SnowflakeUtils.fromTimestamp({
  timestamp: new Date('2023-06-15T12:30:45.000Z'),
});
```

#### convert

Converte um ID Snowflake para um formato diferente.

```javascript
// Converter para string
const stringId = SnowflakeUtils.convert({
  snowflakeId: 1322717493961297921n,
  toFormat: 'string',
});
// Resultado: "1322717493961297921"

// Converter para bigint
const bigintId = SnowflakeUtils.convert({
  snowflakeId: '1322717493961297921',
  toFormat: 'bigint',
});
// Resultado: 1322717493961297921n
```

### NumberUtils

Utilitários para manipulação de números.

```javascript
// Formatar número como moeda
const currency = NumberUtils.formatCurrency({
  value: 1234.56,
  locale: 'pt-BR',
  currency: 'BRL',
});
// Resultado: "R$ 1.234,56"

// Arredondar para um número específico de casas decimais
const rounded = NumberUtils.round({
  value: 3.14159,
  decimals: 2,
});
// Resultado: 3.14
```

### ObjectUtils

Utilitários para manipulação de objetos.

```javascript
// Mesclar objetos profundamente
const merged = ObjectUtils.deepMerge({
  target: { a: 1, b: { c: 2 } },
  source: { b: { d: 3 }, e: 4 },
});
// Resultado: { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Achatar um objeto aninhado
const flattened = ObjectUtils.flatten({
  obj: { a: 1, b: { c: 2, d: { e: 3 } } },
});
// Resultado: { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### UUIDUtils

Utilitários para geração e validação de UUIDs.

```javascript
// Gerar UUID v4
const uuid = UUIDUtils.generate();
// Resultado: "123e4567-e89b-12d3-a456-426614174000"

// Verificar se uma string é um UUID válido
const isValid = UUIDUtils.isValid({
  uuid: '123e4567-e89b-12d3-a456-426614174000',
});
// Resultado: true
```

### ValidationUtils

Utilitários para validação de dados.

```javascript
// Verificar se um valor é um e-mail válido
const isValidEmail = ValidationUtils.isEmail({ value: 'user@example.com' });
// Resultado: true

// Verificar se um valor é um número de telefone válido
const isValidPhone = ValidationUtils.isPhoneNumber({ value: '+5511999999999' });
// Resultado: true
```

## Estrutura de Testes

Os testes estão organizados em uma estrutura híbrida que combina organização por tipo de teste com organização por funcionalidade:

```
tests/
├── unit/                  # Testes unitários
│   ├── array.service.spec.ts
│   ├── string.service.spec.ts
│   └── ...
├── integration/           # Testes de integração
│   ├── array.service.int-spec.ts
│   ├── string.service.int-spec.ts
│   └── ...
└── benchmark/             # Testes de benchmark/performance
    ├── array.service.bench.ts
    ├── string.service.bench.ts
    └── ...
```

### Tipos de Testes

- **Testes Unitários**: Testam unidades individuais de código isoladamente
- **Testes de Integração**: Testam a interação entre diferentes partes do código
- **Testes de Benchmark**: Medem e garantem o desempenho do código

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar apenas testes de benchmark
npm run test:benchmark
```

## Desenvolvimento

### Instalação

```bash
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## Licença

MIT
