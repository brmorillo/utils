
# @brunormorillo/js-util-library

Uma biblioteca de utilitários para manipulação de datas com TypeScript, usando a poderosa biblioteca [Luxon](https://moment.github.io/luxon/).

## Índice
- [Instalação](#instalação)
- [Uso](#uso)
- [Funções Disponíveis](#funções-disponíveis)
- [Exemplos](#exemplos)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Instalação

Instale a biblioteca usando `pnpm`:

```bash
pnpm add @brunormorillo/js-util-library
```

Ou, com `npm`:

```bash
npm install @brunormorillo/js-util-library
```

## Uso

Importe as funções utilitárias para seu projeto:

```typescript
import { dateNow, createInterval, addTime, removeTime, diffBetweenDates, toUTC, toUserTimeZone } from '@brunormorillo/js-util-library';
```

## Funções Disponíveis

Abaixo estão as principais funções oferecidas por esta biblioteca:

### `dateNow`

Retorna a data e hora atual, em UTC ou no fuso horário do sistema.

```typescript
function dateNow(utc: boolean = false): DateTime;
```

- **Parâmetro**: `utc` (opcional) - Define se a data deve estar em UTC (padrão: `false`).
- **Retorno**: `DateTime` da data atual.

### `createInterval`

Cria um intervalo entre duas datas.

```typescript
function createInterval(startDate: DateTime | string, endDate: DateTime | string): Interval;
```

- **Parâmetros**:
  - `startDate`: Data de início (DateTime ou string ISO).
  - `endDate`: Data de término (DateTime ou string ISO).
- **Retorno**: Um `Interval` entre as datas.

### `addTime`

Adiciona um tempo específico a uma data.

```typescript
function addTime(date: DateTime | string, timeToAdd: Duration | object): DateTime;
```

- **Parâmetros**:
  - `date`: Data inicial (DateTime ou string ISO).
  - `timeToAdd`: Objeto representando o tempo a adicionar (ex: `{ days: 1, hours: 5 }`).
- **Retorno**: `DateTime` com o tempo adicionado.

### `removeTime`

Remove um tempo específico de uma data.

```typescript
function removeTime(date: DateTime | string, timeToRemove: Duration | object): DateTime;
```

- **Parâmetros**:
  - `date`: Data inicial (DateTime ou string ISO).
  - `timeToRemove`: Objeto representando o tempo a remover (ex: `{ weeks: 2 }`).
- **Retorno**: `DateTime` com o tempo subtraído.

### `diffBetweenDates`

Calcula a diferença entre duas datas em unidades específicas.

```typescript
function diffBetweenDates(startDate: DateTime | string, endDate: DateTime | string, units: (keyof DurationLikeObject)[]): Duration;
```

- **Parâmetros**:
  - `startDate`: Data de início (DateTime ou string).
  - `endDate`: Data de término (DateTime ou string).
  - `units`: Unidades de tempo para o cálculo (ex: 'days', 'hours').
- **Retorno**: `Duration` com as unidades e a diferença calculada.

### `toUTC`

Converte uma data para UTC.

```typescript
function toUTC(date: DateTime | string): DateTime;
```

- **Parâmetro**: `date` - Data para conversão (DateTime ou string).
- **Retorno**: `DateTime` em UTC.

### `toUserTimeZone`

Converte uma data para o fuso horário especificado.

```typescript
function toUserTimeZone(date: DateTime | string, timeZone: string): DateTime;
```

- **Parâmetros**:
  - `date`: Data para conversão (DateTime ou string).
  - `timeZone`: String do fuso horário (ex: 'America/New_York').
- **Retorno**: `DateTime` no fuso horário do usuário.

## Exemplos

Aqui estão alguns exemplos de como usar as funções desta biblioteca:

```typescript
import { dateNow, createInterval, addTime, removeTime } from '@brunormorillo/js-util-library';

// Obtendo a data atual
const currentDate = dateNow();

// Criando um intervalo entre duas datas
const interval = createInterval('2023-01-01', '2023-12-31');

// Adicionando e removendo tempo
const futureDate = addTime(currentDate, { days: 10 });
const pastDate = removeTime(currentDate, { weeks: 1 });
```

## Contribuindo

Contribuições são bem-vindas! Para contribuir, por favor, faça um fork deste repositório e envie um pull request com suas melhorias.

## Licença

Este projeto está licenciado sob a licença MIT.
