/**
 * Test utility function to validate Git Flow automation
 * This is a simple test function to verify the automated release process
 */
export class GitFlowTestUtils {
  /**
   * Returns the current Git Flow configuration status
   * @param params - The parameters for the method
   * @param params.includeVersion - Whether to include version information
   * @returns Git Flow status information
   * @example
   * GitFlowTestUtils.getGitFlowStatus({
   *   includeVersion: true
   * }); // { status: 'active', version: '12.0.0', automation: true }
   */
  public static getGitFlowStatus({
    includeVersion = false,
  }: {
    includeVersion?: boolean;
  } = {}): {
    status: string;
    automation: boolean;
    version?: string;
    features: string[];
  } {
    const status = {
      status: 'active',
      automation: true,
      features: [
        'automatic-versioning',
        'conventional-commits', 
        'changelog-generation',
        'npm-publishing',
        'github-releases',
        'branch-protection',
        'pr-automation'
      ]
    };

    if (includeVersion) {
      // In a real scenario, this would read from package.json
      return {
        ...status,
        version: '12.0.0'
      };
    }

    return status;
  }

  /**
   * Validates if a commit message follows conventional commit format
   * @param params - The parameters for the method  
   * @param params.message - The commit message to validate
   * @returns Validation result with details
   * @example
   * GitFlowTestUtils.validateCommitMessage({
   *   message: 'feat: add new utility function'
   * }); // { valid: true, type: 'feat', scope: null, description: 'add new utility function' }
   */
  public static validateCommitMessage({
    message,
  }: {
    message: string;
  }): {
    valid: boolean;
    type?: string;
    scope?: string | null;
    description?: string;
    breaking?: boolean;
  } {
    // Conventional commit pattern: type(scope): description
    const conventionalPattern = /^(feat|fix|chore|docs|style|refactor|test|perf|ci|build)(\([^)]*\))?(!)?: (.+)$/;
    const match = message.match(conventionalPattern);

    if (!match) {
      return { valid: false };
    }

    const [, type, scope, breaking, description] = match;

    return {
      valid: true,
      type,
      scope: scope ? scope.slice(1, -1) : null,
      description,
      breaking: !!breaking
    };
  }

  /**
   * Simulates version bump based on commit types
   * @param params - The parameters for the method
   * @param params.currentVersion - Current version in semver format
   * @param params.commitType - Type of commit (feat, fix, etc.)
   * @param params.breaking - Whether this is a breaking change
   * @returns New version after bump
   * @example
   * GitFlowTestUtils.simulateVersionBump({
   *   currentVersion: '1.0.0',
   *   commitType: 'feat',
   *   breaking: false
   * }); // '1.1.0'
   */
  public static simulateVersionBump({
    currentVersion,
    commitType,
    breaking = false,
  }: {
    currentVersion: string;
    commitType: string;
    breaking?: boolean;
  }): string {
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    if (breaking || commitType === 'feat!' || commitType === 'fix!') {
      return `${major + 1}.0.0`;
    }

    if (commitType === 'feat') {
      return `${major}.${minor + 1}.0`;
    }

    if (commitType === 'fix') {
      return `${major}.${minor}.${patch + 1}`;
    }

    // No version bump for other types
    return currentVersion;
  }
}
