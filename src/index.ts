import { ArrayUtils } from './services/array.service';
import { ConvertUtils } from './services/convert.service';
import { CryptUtils } from './services/crypt.service';
import { CuidUtils } from './services/cuid.service';
import { DateUtils } from './services/date.service';
import { HashUtils } from './services/hash.service';
import { JWTUtils } from './services/jwt.service';
import { MathUtils } from './services/math.service';
import { NumberUtils } from './services/number.service';
import { ObjectUtils } from './services/object.service';
import { RequestUtils } from './services/request.service';
import { SnowflakeUtils } from './services/snowflake.service';
import { SortUtils } from './services/sort.service';
import { StringUtils } from './services/string.service';
import { UUIDUtils } from './services/uuid.service';
import { ValidationUtils } from './services/validation.service';
import {
  normalizeValue,
  normalizeNumber,
  createNormalizedProxy,
} from './utils/normalize.util';

// Exporta todas as classes de utilidades
export {
  ArrayUtils,
  ConvertUtils,
  CryptUtils,
  CuidUtils,
  DateUtils,
  HashUtils,
  JWTUtils,
  MathUtils,
  NumberUtils,
  ObjectUtils,
  RequestUtils,
  SnowflakeUtils,
  SortUtils,
  StringUtils,
  UUIDUtils,
  ValidationUtils,
  // Funções de normalização
  normalizeValue,
  normalizeNumber,
  createNormalizedProxy,
};

// Exporta um objeto Utils que contém todas as utilidades para acesso mais conveniente
export const Utils = {
  Array: ArrayUtils,
  Convert: ConvertUtils,
  Crypt: CryptUtils,
  Cuid: CuidUtils,
  Date: DateUtils,
  Hash: HashUtils,
  JWT: JWTUtils,
  Math: MathUtils,
  Number: NumberUtils,
  Object: ObjectUtils,
  Request: RequestUtils,
  Snowflake: SnowflakeUtils,
  Sort: SortUtils,
  String: StringUtils,
  Uuid: UUIDUtils,
  Validation: ValidationUtils,
  // Funções de normalização
  normalize: {
    value: normalizeValue,
    number: normalizeNumber,
    proxy: createNormalizedProxy,
  },
};

// Exportação padrão para compatibilidade com diferentes sistemas de módulos
export default {
  Utils,
  ArrayUtils,
  ConvertUtils,
  CryptUtils,
  CuidUtils,
  DateUtils,
  HashUtils,
  JWTUtils,
  MathUtils,
  NumberUtils,
  ObjectUtils,
  RequestUtils,
  SnowflakeUtils,
  SortUtils,
  StringUtils,
  UUIDUtils,
  ValidationUtils,
  normalizeValue,
  normalizeNumber,
  createNormalizedProxy,
};