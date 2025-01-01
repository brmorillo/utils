// Export individual utilities para ESM direto
export * from './services/array.service';
export * from './services/convert.service';
export * from './services/crypt.service';
export * from './services/cuid.service';
export * from './services/date.service';
export * from './services/math.service';
export * from './services/number.service';
export * from './services/request.service';
export * from './services/snowflake.service';
export * from './services/string.service';
export * from './services/uuid.service';
export * from './services/validation.service';

// Export default como um único objeto
import * as arrayUtils from './services/array.service';
import * as convertUtils from './services/convert.service';
import * as cryptUtils from './services/crypt.service';
import * as cuidUtils from './services/cuid.service';
import * as dateUtils from './services/date.service';
import * as mathUtils from './services/math.service';
import * as numberUtils from './services/number.service';
import * as requestUtils from './services/request.service';
import * as snowflakeUtils from './services/snowflake.service';
import * as stringUtils from './services/string.service';
import * as uuidV4Utils from './services/uuid.service';
import * as validationUtils from './services/validation.service';

const Utils = {
  ...arrayUtils,
  ...convertUtils,
  ...cryptUtils,
  ...cuidUtils,
  ...dateUtils,
  ...mathUtils,
  ...numberUtils,
  ...requestUtils,
  ...snowflakeUtils,
  ...stringUtils,
  ...uuidV4Utils,
  ...validationUtils,
};

export default Utils;
