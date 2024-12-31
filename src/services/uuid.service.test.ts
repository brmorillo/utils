import {
  v1 as uuidv1,
  v4 as uuidv4,
  v5 as uuidv5,
  validate as validateUuid,
} from 'uuid';
import { UUIDUtils } from './uuid.service';

jest.mock('uuid');

// Explicitly cast the imported functions to `jest.Mock` to avoid TypeScript errors
const mockUuidV1 = uuidv1 as jest.Mock;
const mockUuidV4 = uuidv4 as jest.Mock;
const mockUuidV5 = uuidv5 as unknown as jest.Mock;

const mockValidateUuid = validateUuid as jest.Mock;

describe('UUIDUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uuidV1Generate', () => {
    it('should generate a valid UUIDv1', () => {
      const mockUUIDv1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      mockUuidV1.mockReturnValue(mockUUIDv1);

      const result = UUIDUtils.uuidV1Generate();

      expect(uuidv1).toHaveBeenCalled();
      expect(result).toBe(mockUUIDv1);
    });
  });

  describe('uuidV4Generate', () => {
    it('should generate a valid UUIDv4', () => {
      const mockUUIDv4 = '3d6f0eb0-5e26-4b2c-a073-84d55dff3d51';
      mockUuidV4.mockReturnValue(mockUUIDv4);

      const result = UUIDUtils.uuidV4Generate();

      expect(uuidv4).toHaveBeenCalled();
      expect(result).toBe(mockUUIDv4);
    });
  });

  describe('uuidV5Generate', () => {
    it('should generate a valid UUIDv5 with a provided namespace', () => {
      const mockNamespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const mockName = 'example';
      const mockUUIDv5 = '2f52e98d-0b5d-566f-8f7b-f5b03b5eb9a6';
      mockUuidV5.mockReturnValue(mockUUIDv5);

      const result = UUIDUtils.uuidV5Generate({
        namespace: mockNamespace,
        name: mockName,
      });

      expect(uuidv5).toHaveBeenCalledWith(mockName, mockNamespace);
      expect(result).toBe(mockUUIDv5);
    });

    it('should generate a valid UUIDv5 with a generated namespace if none is provided', () => {
      const mockName = 'example';
      const mockGeneratedNamespace = '3d6f0eb0-5e26-4b2c-a073-84d55dff3d51';
      const mockUUIDv5 = '2f52e98d-0b5d-566f-8f7b-f5b03b5eb9a6';

      mockUuidV4.mockReturnValue(mockGeneratedNamespace);
      mockUuidV5.mockReturnValue(mockUUIDv5);

      const result = UUIDUtils.uuidV5Generate({ name: mockName });

      expect(uuidv4).toHaveBeenCalled();
      expect(uuidv5).toHaveBeenCalledWith(mockName, mockGeneratedNamespace);
      expect(result).toBe(mockUUIDv5);
    });
  });

  describe('uuidIsValid', () => {
    it('should return true for a valid UUID', () => {
      const mockUUID = '3d6f0eb0-5e26-4b2c-a073-84d55dff3d51';
      mockValidateUuid.mockReturnValue(true);

      const result = UUIDUtils.uuidIsValid({ id: mockUUID });

      expect(validateUuid).toHaveBeenCalledWith(mockUUID);
      expect(result).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      const mockInvalidUUID = 'invalid-uuid';
      mockValidateUuid.mockReturnValue(false);

      const result = UUIDUtils.uuidIsValid({ id: mockInvalidUUID });

      expect(validateUuid).toHaveBeenCalledWith(mockInvalidUUID);
      expect(result).toBe(false);
    });
  });
});
