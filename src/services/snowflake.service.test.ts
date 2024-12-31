import { Snowflake } from '@sapphire/snowflake';
import {
  DEFAULT_EPOCH,
  DEFAULT_PROCESS_ID,
  DEFAULT_WORKER_ID,
} from '../config/snowflake.config';
import { SnowflakeUtils } from './snowflake.service';

// Mock Snowflake
jest.mock('@sapphire/snowflake');

describe('SnowflakeUtils', () => {
  const mockSnowflake = {
    generate: jest.fn(),
    deconstruct: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    // Mocking Snowflake constructor to return mockSnowflake
    (Snowflake as unknown as jest.Mock).mockImplementation(() => mockSnowflake);
  });

  describe('generateSnowflake', () => {
    it('should generate a unique Snowflake ID as a string', () => {
      const mockId = BigInt('1234567890123456789');
      mockSnowflake.generate.mockReturnValue(mockId);

      const result = SnowflakeUtils.generateSnowflake();

      expect(mockSnowflake.generate).toHaveBeenCalledWith({
        workerId: DEFAULT_WORKER_ID,
        processId: DEFAULT_PROCESS_ID,
      });
      expect(result).toBe(mockId.toString());
    });
  });

  describe('isValidSnowflake', () => {
    it('should return true for a valid Snowflake ID', () => {
      const mockId = BigInt('1234567890123456789');
      const mockDeconstructed = {
        timestamp: new Date(DEFAULT_EPOCH).getTime() + 1000,
        workerId: 0,
        processId: 0,
        increment: 1,
      };

      mockSnowflake.deconstruct.mockReturnValue(mockDeconstructed);

      const result = SnowflakeUtils.isValidSnowflake({ id: mockId.toString() });

      expect(mockSnowflake.deconstruct).toHaveBeenCalledWith(mockId);
      expect(result).toBe(true);
    });

    it('should return false for an invalid Snowflake ID (non-numeric)', () => {
      const result = SnowflakeUtils.isValidSnowflake({ id: 'invalid-id' });

      expect(result).toBe(false);
    });

    it('should return false for an invalid Snowflake ID (deconstruction failure)', () => {
      const mockId = BigInt('1234567890123456789');
      mockSnowflake.deconstruct.mockImplementation(() => {
        throw new Error('Deconstruction failed');
      });

      const result = SnowflakeUtils.isValidSnowflake({ id: mockId.toString() });

      expect(mockSnowflake.deconstruct).toHaveBeenCalledWith(mockId);
      expect(result).toBe(false);
    });

    it('should return false for a Snowflake ID with invalid components', () => {
      const mockId = BigInt('1234567890123456789');
      const mockDeconstructed = {
        timestamp: new Date(DEFAULT_EPOCH).getTime() - 1000, // Invalid timestamp
        workerId: 0,
        processId: 0,
        increment: 1,
      };

      mockSnowflake.deconstruct.mockReturnValue(mockDeconstructed);

      const result = SnowflakeUtils.isValidSnowflake({ id: mockId.toString() });

      expect(mockSnowflake.deconstruct).toHaveBeenCalledWith(mockId);
      expect(result).toBe(false);
    });
  });
});
