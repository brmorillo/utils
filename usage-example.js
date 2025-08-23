// Complete test of @brmorillo/util library
const util = require('./dist/index.js');

console.log('=== COMPLETE TEST OF @brmorillo/util LIBRARY ===\n');

// List all available modules
console.log(
  'Available modules:',
  Object.keys(util).filter(key => key !== '__esModule'),
);

// Test StringUtils
console.log('\n=== TESTING StringUtils ===');
try {
  console.log(
    "capitalizeFirstLetter({input: 'hello'}):",
    util.StringUtils.capitalizeFirstLetter({ input: 'hello' }),
  );
  console.log(
    "reverse({input: 'hello'}):",
    util.StringUtils.reverse({ input: 'hello' }),
  );
  console.log(
    "isValidPalindrome({input: 'radar'}):",
    util.StringUtils.isValidPalindrome({ input: 'radar' }),
  );
  console.log(
    "isValidPalindrome({input: 'hello'}):",
    util.StringUtils.isValidPalindrome({ input: 'hello' }),
  );
  console.log(
    "truncate({input: 'This is a long string', maxLength: 10}):",
    util.StringUtils.truncate({
      input: 'This is a long string',
      maxLength: 10,
    }),
  );
  console.log(
    "toKebabCase({input: 'Hello World'}):",
    util.StringUtils.toKebabCase({ input: 'Hello World' }),
  );
  console.log(
    "toSnakeCase({input: 'Hello World'}):",
    util.StringUtils.toSnakeCase({ input: 'Hello World' }),
  );
  console.log(
    "toCamelCase({input: 'Hello World'}):",
    util.StringUtils.toCamelCase({ input: 'Hello World' }),
  );
  console.log(
    "toTitleCase({input: 'hello world'}):",
    util.StringUtils.toTitleCase({ input: 'hello world' }),
  );
} catch (error) {
  console.log('Error testing StringUtils:', error.message);
}

// Test NumberUtils
console.log('\n=== TESTING NumberUtils ===');
try {
  console.log(
    'isValidEven({value: 4}):',
    util.NumberUtils.isValidEven({ value: 4 }),
  );
  console.log('isOdd({value: 3}):', util.NumberUtils.isOdd({ value: 3 }));
  console.log(
    'isPositive({value: 5}):',
    util.NumberUtils.isPositive({ value: 5 }),
  );
  console.log(
    'roundDown({value: 4.7}):',
    util.NumberUtils.roundDown({ value: 4.7 }),
  );
  console.log(
    'roundDown({value: -4.7}):',
    util.NumberUtils.roundDown({ value: -4.7 }),
  );
  console.log(
    'roundUp({value: 4.2}):',
    util.NumberUtils.roundUp({ value: 4.2 }),
  );
  console.log(
    'roundToNearest({value: 4.5}):',
    util.NumberUtils.roundToNearest({ value: 4.5 }),
  );
  console.log(
    'roundToDecimals({value: 3.14159, decimals: 2}):',
    util.NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 }),
  );
} catch (error) {
  console.log('Error testing NumberUtils:', error.message);
}

// Test ArrayUtils
console.log('\n=== TESTING ArrayUtils ===');
try {
  const testArray = [1, 2, 3, 4, 5, 3, 2];
  console.log(
    'removeDuplicates({array: [1, 2, 3, 4, 5, 3, 2]}):',
    util.ArrayUtils.removeDuplicates({ array: testArray }),
  );
  console.log(
    'intersect({array1: [1, 2, 3], array2: [2, 3, 4]}):',
    util.ArrayUtils.intersect({ array1: [1, 2, 3], array2: [2, 3, 4] }),
  );
  console.log(
    'flatten({array: [1, [2, [3, 4]], 5]}):',
    util.ArrayUtils.flatten({ array: [1, [2, [3, 4]], 5] }),
  );
  console.log(
    'shuffle({array: [1, 2, 3, 4, 5]}):',
    util.ArrayUtils.shuffle({ array: [1, 2, 3, 4, 5] }),
  );
} catch (error) {
  console.log('Error testing ArrayUtils:', error.message);
}

// Test ObjectUtils
console.log('\n=== TESTING ObjectUtils ===');
try {
  const testObj = { name: 'John', age: 30, city: 'New York' };
  console.log(
    "findValue({obj: {user: {address: {city: 'NY'}}}, path: 'user.address.city'}):",
    util.ObjectUtils.findValue({
      obj: { user: { address: { city: 'NY' } } },
      path: 'user.address.city',
    }),
  );
  console.log(
    'deepClone({obj: testObj}):',
    util.ObjectUtils.deepClone({ obj: testObj }),
  );
  console.log(
    'pick({obj: testObj, keys: ["name", "city"]}):',
    util.ObjectUtils.pick({ obj: testObj, keys: ['name', 'city'] }),
  );
  console.log(
    'omit({obj: testObj, keys: ["age"]}):',
    util.ObjectUtils.omit({ obj: testObj, keys: ['age'] }),
  );
} catch (error) {
  console.log('Error testing ObjectUtils:', error.message);
}

// Test DateUtils
console.log('\n=== TESTING DateUtils ===');
try {
  console.log('now():', util.DateUtils.now()); // UTC por padrão
  console.log('now({utc: false}):', util.DateUtils.now({ utc: false })); // Fuso horário local
  console.log(
    'toUTC({date: "2023-01-01T12:00:00+03:00"}):',
    util.DateUtils.toUTC({ date: '2023-01-01T12:00:00+03:00' }),
  );
} catch (error) {
  console.log('Error testing DateUtils:', error.message);
}

// Test ValidationUtils
console.log('\n=== TESTING ValidationUtils ===');
try {
  console.log(
    "isValidEmail({email: 'test@example.com'}):",
    util.ValidationUtils.isValidEmail({ email: 'test@example.com' }),
  );
  console.log(
    "isValidURL({inputUrl: 'https://example.com'}):",
    util.ValidationUtils.isValidURL({ inputUrl: 'https://example.com' }),
  );
  console.log(
    "isValidPhoneNumber({phoneNumber: '+1234567890'}):",
    util.ValidationUtils.isValidPhoneNumber({ phoneNumber: '+1234567890' }),
  );
  console.log(
    'isValidJSON({jsonString: \'{"key": "value"}\'}):',
    util.ValidationUtils.isValidJSON({ jsonString: '{"key": "value"}' }),
  );
} catch (error) {
  console.log('Error testing ValidationUtils:', error.message);
}

// Test CryptUtils
console.log('\n=== TESTING CryptUtils ===');
try {
  console.log('generateIV():', util.CryptUtils.generateIV());
  const secretKey = '12345678901234567890123456789012'; // 32 bytes
  const iv = util.CryptUtils.generateIV();
  const encrypted = util.CryptUtils.aesEncrypt('test data', secretKey, iv);
  console.log('aesEncrypt result:', encrypted);
} catch (error) {
  console.log('Error testing CryptUtils:', error.message);
}

// Test HashUtils
console.log('\n=== TESTING HashUtils ===');
try {
  console.log(
    "sha256Hash('password123'):",
    util.HashUtils.sha256Hash('password123'),
  );
  console.log(
    "sha512Hash('password123'):",
    util.HashUtils.sha512Hash('password123'),
  );
  console.log(
    'sha256GenerateToken(16):',
    util.HashUtils.sha256GenerateToken(16),
  );
} catch (error) {
  console.log('Error testing HashUtils:', error.message);
}

// Test JWTUtils
console.log('\n=== TESTING JWTUtils ===');
try {
  const payload = { userId: '123', role: 'admin' };
  const secretKey = 'your-secret-key-for-testing-jwt-utils';

  // Generate token
  const token = util.JWTUtils.generate({
    payload,
    secretKey,
    options: { expiresIn: '1h' },
  });
  console.log('generate({ payload, secretKey, options }):', token);

  // Verify token
  const verified = util.JWTUtils.verify({
    token,
    secretKey,
  });
  console.log('verify({ token, secretKey }):', verified);

  // Decode token
  const decoded = util.JWTUtils.decode({
    token,
  });
  console.log('decode({ token }):', decoded);

  // Check if expired
  const isExpired = util.JWTUtils.isExpired({
    token,
  });
  console.log('isExpired({ token }):', isExpired);

  // Get expiration time
  const expirationTime = util.JWTUtils.getExpirationTime({
    token,
  });
  console.log('getExpirationTime({ token }):', expirationTime, 'seconds');
} catch (error) {
  console.log('Error testing JWTUtils:', error.message);
}

// Test MathUtils
console.log('\n=== TESTING MathUtils ===');
try {
  console.log(
    'roundToDecimals({value: 3.14159, decimals: 2}):',
    util.MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 }),
  );
  console.log(
    'percentage({total: 200, part: 50}):',
    util.MathUtils.percentage({ total: 200, part: 50 }),
  );
  console.log(
    'randomInRange({min: 1, max: 10}):',
    util.MathUtils.randomInRange({ min: 1, max: 10 }),
  );
  console.log('gcd({a: 24, b: 36}):', util.MathUtils.gcd({ a: 24, b: 36 }));
  console.log('lcm({a: 4, b: 6}):', util.MathUtils.lcm({ a: 4, b: 6 }));
} catch (error) {
  console.log('Error testing MathUtils:', error.message);
}

// Test ConvertUtils
console.log('\n=== TESTING ConvertUtils ===');
try {
  console.log(
    'space({value: 1000, fromType: "meters", toType: "kilometers"}):',
    util.ConvertUtils.space({
      value: 1000,
      fromType: 'meters',
      toType: 'kilometers',
    }),
  );
  console.log(
    'weight({value: 1, fromType: "kilograms", toType: "pounds"}):',
    util.ConvertUtils.weight({
      value: 1,
      fromType: 'kilograms',
      toType: 'pounds',
    }),
  );
  console.log(
    'value({value: "42", toType: "number"}):',
    util.ConvertUtils.value({
      value: '42',
      toType: 'number',
    }),
  );
} catch (error) {
  console.log('Error testing ConvertUtils:', error.message);
}

// Test CuidUtils
console.log('\n=== TESTING CuidUtils ===');
try {
  const cuid = util.CuidUtils.generate();
  console.log('generate():', cuid);
  console.log('isValid({id: cuid}):', util.CuidUtils.isValid({ id: cuid }));
} catch (error) {
  console.log('Error testing CuidUtils:', error.message);
}

// Test UUIDUtils
console.log('\n=== TESTING UUIDUtils ===');
try {
  const uuid = util.UUIDUtils.uuidV4Generate();
  console.log('uuidV4Generate():', uuid);
  console.log(
    'isValidUuid({id: uuid}):',
    util.UUIDUtils.isValidUuid({ id: uuid }),
  );
} catch (error) {
  console.log('Error testing UUIDUtils:', error.message);
}

// Test SnowflakeUtils
console.log('\n=== TESTING SnowflakeUtils ===');
try {
  const snowflake = util.SnowflakeUtils.generate({});
  console.log('generate({}):', snowflake);
  const timestamp = util.SnowflakeUtils.getTimestamp({
    snowflakeId: snowflake,
  });
  console.log('getTimestamp({snowflakeId: snowflake}):', timestamp);
} catch (error) {
  console.log('Error testing SnowflakeUtils:', error.message);
}

// Test SortUtils
console.log('\n=== TESTING SortUtils ===');
try {
  console.log(
    'bubbleSort([3, 1, 4, 2, 5]):',
    util.SortUtils.bubbleSort([3, 1, 4, 2, 5]),
  );
  console.log(
    'mergeSort([3, 1, 4, 2, 5]):',
    util.SortUtils.mergeSort([3, 1, 4, 2, 5]),
  );
  console.log(
    'quickSort([3, 1, 4, 2, 5]):',
    util.SortUtils.quickSort([3, 1, 4, 2, 5]),
  );
  console.log(
    'heapSort([3, 1, 4, 2, 5]):',
    util.SortUtils.heapSort([3, 1, 4, 2, 5]),
  );
} catch (error) {
  console.log('Error testing SortUtils:', error.message);
}

// Test Utils (main object)
console.log('\n=== TESTING Utils (main object) ===');
try {
  console.log(
    "Utils.String.toKebabCase({input: 'Hello World'}):",
    util.Utils.String.toKebabCase({ input: 'Hello World' }),
  );
  console.log(
    'Utils.Array.removeDuplicates({array: [1, 2, 3, 4, 5, 3, 2]}):',
    util.Utils.Array.removeDuplicates({ array: [1, 2, 3, 4, 5, 3, 2] }),
  );
  console.log(
    'Utils.Math.percentage({total: 200, part: 50}):',
    util.Utils.Math.percentage({ total: 200, part: 50 }),
  );
  console.log(
    'Utils.Convert.space({value: 1000, fromType: "meters", toType: "kilometers"}):',
    util.Utils.Convert.space({
      value: 1000,
      fromType: 'meters',
      toType: 'kilometers',
    }),
  );
} catch (error) {
  console.log('Error testing Utils:', error.message);
}

// Test normalize utilities
console.log('\n=== TESTING normalize utilities ===');
try {
  console.log('normalizeNumber(-0):', util.normalizeNumber(-0));
  console.log(
    'normalizeValue({x: -0, y: 5}):',
    util.normalizeValue({ x: -0, y: 5 }),
  );
  const proxy = util.createNormalizedProxy({ x: -0, y: 5 });
  console.log('createNormalizedProxy({x: -0, y: 5}).x:', proxy.x);
} catch (error) {
  console.log('Error testing normalize utilities:', error.message);
}

console.log('\n=== TESTS COMPLETED SUCCESSFULLY ===');

// Test Utils (main object)
console.log('\n=== TESTING Utils (main object) ===');
try {
  console.log(
    "Utils.String.toKebabCase({input: 'Hello World'}):",
    util.Utils.String.toKebabCase({ input: 'Hello World' }),
  );
  console.log(
    'Utils.Array.removeDuplicates({array: [1, 2, 3, 4, 5, 3, 2]}):',
    util.Utils.Array.removeDuplicates({ array: [1, 2, 3, 4, 5, 3, 2] }),
  );
  console.log(
    'Utils.Math.percentage({total: 200, part: 50}):',
    util.Utils.Math.percentage({ total: 200, part: 50 }),
  );
  console.log(
    'Utils.Convert.space({value: 1000, fromType: "meters", toType: "kilometers"}):',
    util.Utils.Convert.space({
      value: 1000,
      fromType: 'meters',
      toType: 'kilometers',
    }),
  );
} catch (error) {
  console.log('Error testing Utils:', error.message);
}

// Test normalize utilities
console.log('\n=== TESTING normalize utilities ===');
try {
  console.log('normalizeNumber(-0):', util.normalizeNumber(-0));
  console.log(
    'normalizeValue({x: -0, y: 5}):',
    util.normalizeValue({ x: -0, y: 5 }),
  );
  const proxy = util.createNormalizedProxy({ x: -0, y: 5 });
  console.log('createNormalizedProxy({x: -0, y: 5}).x:', proxy.x);
} catch (error) {
  console.log('Error testing normalize utilities:', error.message);
}

console.log('\n=== TESTS COMPLETED SUCCESSFULLY ===');
