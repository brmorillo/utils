import { SnowflakeUtils } from './snowflake.service';

describe('SnowflakeUtils', () => {
  describe('generate', () => {
    it('should generate a valid Snowflake ID with default epoch', () => {
      const id = SnowflakeUtils.generate({});
      expect(typeof id).toBe('bigint');
      expect(id).toBeGreaterThan(0n);
    });

    it('should generate a valid Snowflake ID with custom epoch', () => {
      const customEpoch = new Date('2020-01-01T00:00:00.000Z');
      const id = SnowflakeUtils.generate({ epoch: customEpoch });
      expect(typeof id).toBe('bigint');
      expect(id).toBeGreaterThan(0n);
    });

    it('should throw an error if an invalid epoch is provided', () => {
      expect(() =>
        SnowflakeUtils.generate({ epoch: new Date('invalid') }),
      ).toThrow('Invalid epoch: must be a valid Date object.');
    });
  });

  describe('decode', () => {
    it('should decode a valid Snowflake ID with default epoch', () => {
      const id = SnowflakeUtils.generate({});
      const components = SnowflakeUtils.decode({ snowflakeId: id });
      expect(components).toHaveProperty('timestamp');
      expect(components).toHaveProperty('workerId');
      expect(components).toHaveProperty('processId');
      expect(components).toHaveProperty('increment');
    });

    it('should decode a valid Snowflake ID with custom epoch', () => {
      const customEpoch = new Date('2020-01-01T00:00:00.000Z');
      const id = SnowflakeUtils.generate({ epoch: customEpoch });
      const components = SnowflakeUtils.decode({
        snowflakeId: id,
        epoch: customEpoch,
      });
      expect(components.timestamp).toBeGreaterThan(0n);
    });

    it('should throw an error if an invalid Snowflake ID is provided', () => {
      expect(() => SnowflakeUtils.decode({ snowflakeId: 'invalid' })).toThrow(
        'Invalid Snowflake ID: must be a valid bigint or string.',
      );
    });

    it('should throw an error if an invalid epoch is provided', () => {
      const id = SnowflakeUtils.generate({});
      expect(() =>
        SnowflakeUtils.decode({
          snowflakeId: id,
          epoch: new Date('invalid'),
        }),
      ).toThrow('Invalid epoch: must be a valid Date object.');
    });
  });

  describe('getTimestamp', () => {
    it('should extract the timestamp from a valid Snowflake ID with default epoch', () => {
      const id = SnowflakeUtils.generate({});
      const timestamp = SnowflakeUtils.getTimestamp({ snowflakeId: id });
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should extract the timestamp from a valid Snowflake ID with custom epoch', () => {
      const customEpoch = new Date('2020-01-01T00:00:00.000Z');
      const id = SnowflakeUtils.generate({ epoch: customEpoch });
      const timestamp = SnowflakeUtils.getTimestamp({
        snowflakeId: id,
        epoch: customEpoch,
      });
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should throw an error if an invalid Snowflake ID is provided', () => {
      expect(() =>
        SnowflakeUtils.getTimestamp({ snowflakeId: 'invalid' }),
      ).toThrow('Invalid Snowflake ID: must be a valid bigint or string.');
    });

    it('should throw an error if an invalid epoch is provided', () => {
      const id = SnowflakeUtils.generate({});
      expect(() =>
        SnowflakeUtils.getTimestamp({
          snowflakeId: id,
          epoch: new Date('invalid'),
        }),
      ).toThrow('Invalid epoch: must be a valid Date object.');
    });
  });
});
