import { GitFlowTestUtils } from '../../src/services/gitflow-test.service';

/**
 * Unit tests for the GitFlowTestUtils class.
 * These tests verify the Git Flow status, conventional commit
 * validation and semantic version bump simulation.
 */
describe('GitFlowTestUtils', () => {
  describe('getGitFlowStatus', () => {
    it('should return the active status without a version by default', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.getGitFlowStatus();

      // Assert
      expect(result.status).toBe('active');
      expect(result.automation).toBe(true);
      expect(result.version).toBeUndefined();
      expect(Array.isArray(result.features)).toBe(true);
      expect(result.features.length).toBeGreaterThan(0);
    });

    it('should not include the version when includeVersion is false', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.getGitFlowStatus({ includeVersion: false });

      // Assert
      expect(result.version).toBeUndefined();
    });

    it('should include the version when includeVersion is true', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.getGitFlowStatus({ includeVersion: true });

      // Assert
      expect(result.version).toBe('13.0.0');
      expect(result.status).toBe('active');
    });
  });

  describe('validateCommitMessage', () => {
    it('should validate a simple conventional commit', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.validateCommitMessage({
        message: 'feat: add new utility function',
      });

      // Assert
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
      expect(result.scope).toBeNull();
      expect(result.description).toBe('add new utility function');
      expect(result.breaking).toBe(false);
    });

    it('should extract the scope from a scoped commit', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.validateCommitMessage({
        message: 'fix(parser): handle empty input',
      });

      // Assert
      expect(result.valid).toBe(true);
      expect(result.type).toBe('fix');
      expect(result.scope).toBe('parser');
      expect(result.description).toBe('handle empty input');
      expect(result.breaking).toBe(false);
    });

    it('should flag a breaking change marked with an exclamation mark', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.validateCommitMessage({
        message: 'feat(api)!: drop legacy endpoint',
      });

      // Assert
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
      expect(result.scope).toBe('api');
      expect(result.breaking).toBe(true);
    });

    it('should reject a message that is not conventional', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.validateCommitMessage({
        message: 'just some random text',
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.type).toBeUndefined();
    });

    it('should reject a message with an unknown type', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.validateCommitMessage({
        message: 'unknown: do something',
      });

      // Assert
      expect(result.valid).toBe(false);
    });
  });

  describe('simulateVersionBump', () => {
    it('should bump the minor version for a feat commit', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '1.0.0',
        commitType: 'feat',
      });

      // Assert
      expect(result).toBe('1.1.0');
    });

    it('should bump the patch version for a fix commit', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '1.2.3',
        commitType: 'fix',
      });

      // Assert
      expect(result).toBe('1.2.4');
    });

    it('should bump the major version for a breaking change', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '1.5.2',
        commitType: 'feat',
        breaking: true,
      });

      // Assert
      expect(result).toBe('2.0.0');
    });

    it('should bump the major version for a feat! commit type', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '3.4.5',
        commitType: 'feat!',
      });

      // Assert
      expect(result).toBe('4.0.0');
    });

    it('should bump the major version for a fix! commit type', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '3.4.5',
        commitType: 'fix!',
      });

      // Assert
      expect(result).toBe('4.0.0');
    });

    it('should not bump the version for other commit types', () => {
      // Arrange & Act
      const result = GitFlowTestUtils.simulateVersionBump({
        currentVersion: '1.0.0',
        commitType: 'chore',
      });

      // Assert
      expect(result).toBe('1.0.0');
    });
  });
});
