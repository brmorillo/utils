// Import all utility modules
import * as arrayUtils from './utils/array.util'
import * as convertUtils from './utils/convert.util'
import * as cryptUtils from './utils/crypt.util'
import * as cuid from './utils/cuid.util'
import * as dateUtils from './utils/date.util'
import * as mathUtils from './utils/math.util'
import * as nativeSnowflakeUtils from './utils/native-snowflake.util'
import * as numberUtils from './utils/number.util'
import * as requestUtils from './utils/request.util'
import * as snowflakeUtils from './utils/snowflake.util'
import * as stringUtils from './utils/string.util'
import * as uuidV4Utils from './utils/uuid-v4.util'
import * as validationUtils from './utils/validation.util'

// Combine all utilities into a single object
const utils = {
  ...arrayUtils,
  ...convertUtils,
  ...cryptUtils,
  ...cuid,
  ...dateUtils,
  ...mathUtils,
  ...nativeSnowflakeUtils,
  ...numberUtils,
  ...requestUtils,
  ...snowflakeUtils,
  ...stringUtils,
  ...uuidV4Utils,
  ...validationUtils,
}

// Export individual utilities for named imports
export * from './utils/array.util'
export * from './utils/convert.util'
export * from './utils/crypt.util'
export * from './utils/cuid.util'
export * from './utils/date.util'
export * from './utils/math.util'
export * from './utils/native-snowflake.util'
export * from './utils/number.util'
export * from './utils/request.util'
export * from './utils/snowflake.util'
export * from './utils/string.util'
export * from './utils/uuid-v4.util'
export * from './utils/validation.util'

// Export the combined object as default
export default utils
