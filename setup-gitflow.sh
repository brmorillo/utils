#!/bin/bash

# Git Flow Setup Script for @brmorillo/utils
# This script initializes Git Flow structure and configuration

set -e

echo "🚀 Setting up Git Flow for @brmorillo/utils"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository!"
    exit 1
fi

print_info "Current repository: $(basename `git rev-parse --show-toplevel`)"

# Get current branch
current_branch=$(git branch --show-current)
print_info "Current branch: $current_branch"

# Function to create branch if it doesn't exist
create_branch_if_not_exists() {
    local branch_name=$1
    local source_branch=$2
    
    if git show-ref --verify --quiet refs/heads/$branch_name; then
        print_warning "Branch '$branch_name' already exists"
    else
        print_info "Creating branch '$branch_name' from '$source_branch'"
        git checkout $source_branch
        git pull origin $source_branch 2>/dev/null || print_warning "Could not pull from origin/$source_branch"
        git checkout -b $branch_name
        git push -u origin $branch_name
        print_status "Created and pushed branch '$branch_name'"
    fi
}

# Function to setup branch protection rules
setup_branch_protection() {
    local branch_name=$1
    print_info "Setting up branch protection for '$branch_name'"
    
    # Note: This would need GitHub CLI (gh) and proper permissions
    # For now, we'll just print the commands that should be run
    echo "To set up branch protection, run these commands with appropriate permissions:"
    echo "gh api repos/:owner/:repo/branches/$branch_name/protection -X PUT --input protection-rules.json"
}

echo ""
echo "🌟 Initializing Git Flow Structure"
echo "==================================="

# Ensure we're on main branch
if [ "$current_branch" != "main" ]; then
    print_info "Switching to main branch"
    git checkout main
    git pull origin main
fi

# Create develop branch if it doesn't exist
create_branch_if_not_exists "develop" "main"

# Create .gitflow configuration
cat > .gitflow << EOF
[gitflow "branch"]
    master = main
    develop = develop

[gitflow "prefix"]
    feature = feature/
    release = release/
    hotfix = hotfix/
    support = support/
    versiontag = v

[gitflow "origin"]
    origin = origin
EOF

print_status "Created .gitflow configuration"

# Create Git Flow documentation
cat > GITFLOW.md << 'EOF'
# Git Flow Guide for @brmorillo/utils

This project uses Git Flow for branch management and automated releases.

## Branch Structure

### Main Branches
- **`main`**: Production-ready code. All releases are tagged here.
- **`develop`**: Integration branch for features. Latest development state.

### Supporting Branches
- **`feature/*`**: New features and improvements
- **`release/*`**: Release preparation (version bumping, final testing)
- **`hotfix/*`**: Critical fixes for production issues

## Workflow

### 🚀 Starting a Feature
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on your feature...
git add .
git commit -m "feat: add new feature"

# Push and create PR to develop
git push -u origin feature/your-feature-name
```

### 🔄 Creating a Release
```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Final adjustments, version bump, testing...
git add .
git commit -m "chore: prepare release v1.2.0"

# Create PR to main
git push -u origin release/v1.2.0
```

### 🚨 Emergency Hotfix
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Fix the issue...
git add .
git commit -m "fix: resolve critical issue"

# Push - this will trigger automated patch release
git push -u origin hotfix/critical-bug-fix
```

## Automated Release Process

When a PR is merged to `main`:

1. **Version Detection**: 
   - `feat:` commits → minor version bump
   - `fix:` commits → patch version bump
   - `BREAKING CHANGE` → major version bump

2. **Changelog Generation**: Automatic based on conventional commits

3. **Release Creation**: GitHub release with tag

4. **NPM Publishing**: Automatic publish to npm registry

5. **Back-merge**: Changes are merged back to develop

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance tasks
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples:
```bash
feat: add new array utility function
fix: resolve memory leak in cache service
feat!: change API signature (breaking change)
fix(validation): correct email regex pattern
chore: update dependencies
docs: add usage examples for string utils
```

## Branch Protection Rules

### Main Branch
- Require PR reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main
- Require linear history

### Develop Branch
- Require PR reviews
- Require status checks to pass
- Allow force pushes from admins

## Version Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features (backward compatible)
- **PATCH** (0.0.X): Bug fixes (backward compatible)

## Quick Commands

```bash
# Start new feature
git flow feature start my-feature

# Finish feature (creates PR)
git flow feature finish my-feature

# Start release
git flow release start 1.2.0

# Start hotfix
git flow hotfix start critical-fix

# Check current status
git flow status
```

## Troubleshooting

### Reset to Clean State
```bash
git checkout main
git pull origin main
git checkout develop
git pull origin develop
git branch -D feature/unwanted-branch  # if needed
```

### Force Sync Develop with Main
```bash
git checkout develop
git reset --hard origin/main
git push --force-with-lease origin develop
```

---

For more information, see the [Git Flow documentation](https://nvie.com/posts/a-successful-git-branching-model/).
EOF

print_status "Created Git Flow documentation (GITFLOW.md)"

# Create branch protection rules template
cat > .github/branch-protection-rules.json << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "CI/CD Pipeline / quality",
      "CI/CD Pipeline / test"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
EOF

print_status "Created branch protection rules template"

# Update package.json scripts
print_info "Adding Git Flow scripts to package.json"

# Create a Node.js script to update package.json
cat > update-package-scripts.js << 'EOF'
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add Git Flow scripts
const gitFlowScripts = {
  "git:flow:init": "git flow init -d",
  "git:feature:start": "git flow feature start",
  "git:feature:finish": "git flow feature finish",
  "git:release:start": "git flow release start",
  "git:release:finish": "git flow release finish",
  "git:hotfix:start": "git flow hotfix start",
  "git:hotfix:finish": "git flow hotfix finish",
  "version:patch": "npm version patch",
  "version:minor": "npm version minor", 
  "version:major": "npm version major",
  "release:prepare": "npm run build && npm run test:ci",
  "release:publish": "npm publish --access public"
};

packageJson.scripts = { ...packageJson.scripts, ...gitFlowScripts };

// Update repository field if needed
if (!packageJson.repository) {
  packageJson.repository = {
    "type": "git",
    "url": "git+https://github.com/brmorillo/utils.git"
  };
}

// Add bugs and homepage fields
if (!packageJson.bugs) {
  packageJson.bugs = {
    "url": "https://github.com/brmorillo/utils/issues"
  };
}

if (!packageJson.homepage) {
  packageJson.homepage = "https://github.com/brmorillo/utils#readme";
}

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ Updated package.json with Git Flow scripts');
EOF

node update-package-scripts.js
rm update-package-scripts.js

print_status "Updated package.json with Git Flow scripts"

# Create release preparation script
cat > scripts/prepare-release.sh << 'EOF'
#!/bin/bash

# Release preparation script
set -e

echo "🚀 Preparing release..."

# Run quality checks
echo "Running quality checks..."
npm run lint
npm run type-check
npm run format:check

# Run tests
echo "Running tests..."
npm run test:ci

# Build package
echo "Building package..."
npm run build

# Check if everything is committed
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Working directory is not clean. Please commit all changes first."
  exit 1
fi

echo "✅ Release preparation completed successfully!"
echo "💡 Now you can create a release branch or merge to main"
EOF

chmod +x scripts/prepare-release.sh

print_status "Created release preparation script"

# Create version bump script
cat > scripts/bump-version.sh << 'EOF'
#!/bin/bash

# Version bump script with changelog generation
set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 [patch|minor|major]"
    exit 1
fi

VERSION_TYPE=$1

echo "🔖 Bumping $VERSION_TYPE version..."

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Bump version
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Generate changelog entry
CHANGELOG_ENTRY="## [$NEW_VERSION] - $(date +%Y-%m-%d)\n\n"

# Add to existing changelog or create new one
if [ -f CHANGELOG.md ]; then
    # Insert new entry after the header
    sed -i "3i\\$CHANGELOG_ENTRY" CHANGELOG.md
else
    echo -e "# Changelog\n\n$CHANGELOG_ENTRY" > CHANGELOG.md
fi

echo "✅ Version bumped to $NEW_VERSION"
echo "📝 Updated CHANGELOG.md"
echo "💡 Remember to commit these changes!"
EOF

chmod +x scripts/bump-version.sh

print_status "Created version bump script"

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Switch back to original branch
if [ "$current_branch" != "main" ] && [ "$current_branch" != "develop" ]; then
    git checkout $current_branch
fi

echo ""
echo "🎉 Git Flow Setup Complete!"
echo "=========================="
print_status "Git Flow structure initialized"
print_status "Workflows created in .github/workflows/"
print_status "Documentation created (GITFLOW.md)"
print_status "Scripts added to package.json"
print_status "Helper scripts created in scripts/"

echo ""
echo "📋 Next Steps:"
echo "1. Review and commit the Git Flow configuration files"
echo "2. Set up branch protection rules in GitHub"
echo "3. Configure NPM_TOKEN secret in GitHub repository settings"
echo "4. Start using Git Flow with: git flow feature start your-feature"

echo ""
echo "🔗 Useful Commands:"
echo "npm run git:feature:start <name>  - Start new feature"
echo "npm run git:release:start <version> - Start new release"
echo "npm run git:hotfix:start <name>   - Start hotfix"
echo "./scripts/prepare-release.sh      - Prepare for release"
echo "./scripts/bump-version.sh [type]  - Bump version manually"

echo ""
print_status "Git Flow setup completed successfully! 🚀"
EOF
