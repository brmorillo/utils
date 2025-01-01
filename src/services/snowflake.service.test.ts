import { DEFAULT_EPOCH, SnowflakeUtils } from './snowflake.service';

describe('SnowflakeUtils', () => {
  describe('generateSnowflake', () => {
    it('should generate a valid Snowflake ID as a string', () => {
      const id = SnowflakeUtils.generateSnowflake();
      expect(typeof id).toBe('string');
      expect(id).not.toBe('');
    });

    it('should generate unique Snowflake IDs', () => {
      const id1 = SnowflakeUtils.generateSnowflake();
      const id2 = SnowflakeUtils.generateSnowflake();
      expect(id1).not.toBe(id2);
    });
  });

  describe('isValidSnowflake', () => {
    it('should return true for a valid Snowflake ID', () => {
      const id = SnowflakeUtils.generateSnowflake();
      const isValid = SnowflakeUtils.isValidSnowflake({ id });
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid Snowflake ID', () => {
      const isValid = SnowflakeUtils.isValidSnowflake({ id: 'invalid_id' });
      expect(isValid).toBe(false);
    });

    it('should return false for an empty string', () => {
      const isValid = SnowflakeUtils.isValidSnowflake({ id: '' });
      expect(isValid).toBe(false);
    });

    it('should return false for a Snowflake ID with incorrect timestamp', () => {
      const invalidId = BigInt(DEFAULT_EPOCH - 1).toString();
      const isValid = SnowflakeUtils.isValidSnowflake({ id: invalidId });
      expect(isValid).toBe(false);
    });
  });

  describe('decodeSnowflake', () => {
    it('should decode a valid Snowflake ID', () => {
      const id = SnowflakeUtils.generateSnowflake();
      const components = SnowflakeUtils.decodeSnowflake({ id });

      expect(components).toHaveProperty('timestamp');
      expect(components).toHaveProperty('datetime');
      expect(components).toHaveProperty('workerId');
      expect(components).toHaveProperty('processId');
      expect(components).toHaveProperty('increment');

      expect(components.timestamp).toBeGreaterThanOrEqual(DEFAULT_EPOCH);
      expect(components.datetime).toBeInstanceOf(Date);
      expect(components.workerId).toBeGreaterThanOrEqual(0n);
      expect(components.processId).toBeGreaterThanOrEqual(0n);
      expect(components.increment).toBeGreaterThanOrEqual(0n);
    });

    it('should throw an error for an invalid Snowflake ID', () => {
      expect(() =>
        SnowflakeUtils.decodeSnowflake({ id: 'invalid_id' }),
      ).toThrow();
    });

    it('should decode a Snowflake ID and match the generated timestamp', () => {
      const id = SnowflakeUtils.generateSnowflake();
      const components = SnowflakeUtils.decodeSnowflake({ id });

      const expectedDatetime = new Date(Number(components.timestamp));
      expect(components.datetime.getTime()).toBe(expectedDatetime.getTime());
    });
  });
});
