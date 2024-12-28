// Import all utility modules
import * as dateUtils from './utils/date.util'
import * as arrayUtils from './utils/array.util'
import * as stringUtils from './utils/string.util'
import * as validationUtils from './utils/validation.util'
import * as numberUtils from './utils/number.util'
import * as mathUtils from './utils/math.util'
import * as convertUtils from './utils/convert.util'
import * as cryptUtils from './utils/crypt.util'

// Combine all utilities into a single object
const utils = {
  ...dateUtils,
  ...arrayUtils,
  ...stringUtils,
  ...validationUtils,
  ...numberUtils,
  ...mathUtils,
  ...convertUtils,
  ...cryptUtils,
}

// Export individual utilities for named imports
export * from './utils/date.util'
export * from './utils/array.util'
export * from './utils/string.util'
export * from './utils/validation.util'
export * from './utils/number.util'
export * from './utils/math.util'
export * from './utils/convert.util'
export * from './utils/crypt.util'

// Export the combined object as default
export default utils
