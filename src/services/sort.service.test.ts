import { SortUtils } from './sort.service';

describe('SortUtils', () => {
  describe('bubbleSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.bubbleSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.bubbleSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.bubbleSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.bubbleSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('mergeSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.mergeSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.mergeSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.mergeSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.mergeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('quickSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.quickSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.quickSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.quickSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.quickSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('heapSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.heapSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.heapSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.heapSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.heapSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });
});
