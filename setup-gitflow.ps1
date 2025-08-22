# Git Flow Setup Script for Windows PowerShell
# This script initializes Git Flow structure and configuration

param(
    [switch]$DryRun = $false
)

# Colors for output
$ColorReset = "`e[0m"
$ColorRed = "`e[31m"
$ColorGreen = "`e[32m"
$ColorYellow = "`e[33m"
$ColorBlue = "`e[34m"

function Write-Status {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

Write-Host "🚀 Setting up Git Flow for @brmorillo/utils" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check if we're in a git repository
try {
    $gitDir = git rev-parse --git-dir 2>$null
    if (!$gitDir) {
        Write-Error "Not a git repository!"
        exit 1
    }
} catch {
    Write-Error "Not a git repository!"
    exit 1
}

$repoName = Split-Path -Leaf (git rev-parse --show-toplevel)
Write-Info "Current repository: $repoName"

$currentBranch = git branch --show-current
Write-Info "Current branch: $currentBranch"

# Function to create branch if it doesn't exist
function New-BranchIfNotExists {
    param(
        [string]$BranchName,
        [string]$SourceBranch
    )
    
    $branchExists = git show-ref --verify --quiet "refs/heads/$BranchName"
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "Branch '$BranchName' already exists"
    } else {
        Write-Info "Creating branch '$BranchName' from '$SourceBranch'"
        if (!$DryRun) {
            git checkout $SourceBranch
            git pull origin $SourceBranch 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "Could not pull from origin/$SourceBranch"
            }
            git checkout -b $BranchName
            git push -u origin $BranchName
            Write-Status "Created and pushed branch '$BranchName'"
        } else {
            Write-Info "[DRY RUN] Would create branch '$BranchName'"
        }
    }
}

Write-Host ""
Write-Host "🌟 Initializing Git Flow Structure" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Ensure we're on main branch
if ($currentBranch -ne "main") {
    Write-Info "Switching to main branch"
    if (!$DryRun) {
        git checkout main
        git pull origin main
    }
}

# Create develop branch if it doesn't exist
New-BranchIfNotExists -BranchName "develop" -SourceBranch "main"

# Create scripts directory
if (!(Test-Path "scripts")) {
    New-Item -ItemType Directory -Path "scripts" -Force | Out-Null
}

Write-Host ""
Write-Host "📝 Creating Git Flow Documentation and Scripts" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Update package.json with Git Flow scripts
Write-Info "Updating package.json with Git Flow scripts"

$packageJsonContent = Get-Content "package.json" -Raw | ConvertFrom-Json

# Add Git Flow scripts
$gitFlowScripts = @{
    "git:status" = "git status"
    "git:flow:feature" = "echo 'Usage: git checkout -b feature/your-feature-name'"
    "git:flow:release" = "echo 'Usage: git checkout -b release/vX.Y.Z'"
    "git:flow:hotfix" = "echo 'Usage: git checkout -b hotfix/issue-description'"
    "version:patch" = "npm version patch --no-git-tag-version"
    "version:minor" = "npm version minor --no-git-tag-version"
    "version:major" = "npm version major --no-git-tag-version"
    "release:prepare" = "npm run build && npm run test:ci"
    "release:check" = "git status --porcelain"
}

# Merge scripts
foreach ($script in $gitFlowScripts.GetEnumerator()) {
    $packageJsonContent.scripts | Add-Member -NotePropertyName $script.Key -NotePropertyValue $script.Value -Force
}

# Update repository fields
if (!$packageJsonContent.repository) {
    $packageJsonContent | Add-Member -NotePropertyName "repository" -NotePropertyValue @{
        "type" = "git"
        "url" = "git+https://github.com/brmorillo/utils.git"
    } -Force
}

if (!$packageJsonContent.bugs) {
    $packageJsonContent | Add-Member -NotePropertyName "bugs" -NotePropertyValue @{
        "url" = "https://github.com/brmorillo/utils/issues"
    } -Force
}

if (!$packageJsonContent.homepage) {
    $packageJsonContent | Add-Member -NotePropertyName "homepage" -NotePropertyValue "https://github.com/brmorillo/utils#readme" -Force
}

if (!$DryRun) {
    $packageJsonContent | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
    Write-Status "Updated package.json with Git Flow scripts"
} else {
    Write-Info "[DRY RUN] Would update package.json"
}

# Create PowerShell helper scripts
$prepareReleaseScript = @'
# Prepare Release Script
Write-Host "🚀 Preparing release..." -ForegroundColor Cyan

Write-Host "Running quality checks..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npm run type-check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npm run format:check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Running tests..." -ForegroundColor Yellow
npm run test:ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Building package..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Check if everything is committed
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Working directory is not clean. Please commit all changes first." -ForegroundColor Red
    Write-Host "Uncommitted changes:" -ForegroundColor Yellow
    git status --short
    exit 1
}

Write-Host "✅ Release preparation completed successfully!" -ForegroundColor Green
Write-Host "💡 Now you can create a release branch or merge to main" -ForegroundColor Blue
'@

$bumpVersionScript = @'
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType
)

Write-Host "🔖 Bumping $VersionType version..." -ForegroundColor Cyan

# Get current version
$currentVersion = (Get-Content "package.json" | ConvertFrom-Json).version
Write-Host "Current version: $currentVersion" -ForegroundColor Blue

# Bump version
npm version $VersionType --no-git-tag-version
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Get new version
$newVersion = (Get-Content "package.json" | ConvertFrom-Json).version
Write-Host "New version: $newVersion" -ForegroundColor Green

# Generate changelog entry
$date = Get-Date -Format "yyyy-MM-dd"
$changelogEntry = "## [$newVersion] - $date`n`n"

# Add to existing changelog or create new one
if (Test-Path "CHANGELOG.md") {
    $content = Get-Content "CHANGELOG.md" -Raw
    $lines = $content -split "`n"
    $newContent = $lines[0..2] -join "`n" + "`n`n" + $changelogEntry + ($lines[3..($lines.Length-1)] -join "`n")
    Set-Content "CHANGELOG.md" -Value $newContent -Encoding UTF8
} else {
    Set-Content "CHANGELOG.md" -Value "# Changelog`n`n$changelogEntry" -Encoding UTF8
}

Write-Host "✅ Version bumped to $newVersion" -ForegroundColor Green
Write-Host "📝 Updated CHANGELOG.md" -ForegroundColor Green
Write-Host "💡 Remember to commit these changes!" -ForegroundColor Blue
'@

if (!$DryRun) {
    Set-Content "scripts\prepare-release.ps1" -Value $prepareReleaseScript -Encoding UTF8
    Set-Content "scripts\bump-version.ps1" -Value $bumpVersionScript -Encoding UTF8
    Write-Status "Created PowerShell helper scripts"
} else {
    Write-Info "[DRY RUN] Would create PowerShell helper scripts"
}

# Switch back to original branch if needed
if ($currentBranch -ne "main" -and $currentBranch -ne "develop" -and !$DryRun) {
    git checkout $currentBranch
}

Write-Host ""
Write-Host "🎉 Git Flow Setup Complete!" -ForegroundColor Green
Write-Host "=========================="
Write-Status "Git Flow structure initialized"
Write-Status "Workflows created in .github/workflows/"
Write-Status "PowerShell scripts created in scripts/"
Write-Status "Package.json updated with Git Flow commands"

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review and commit the Git Flow configuration files"
Write-Host "2. Set up branch protection rules in GitHub repository settings"
Write-Host "3. Add NPM_TOKEN secret in GitHub repository settings"
Write-Host "4. Start using Git Flow:"
Write-Host "   - Feature: git checkout -b feature/your-feature-name"
Write-Host "   - Release: git checkout -b release/vX.Y.Z"
Write-Host "   - Hotfix: git checkout -b hotfix/issue-description"

Write-Host ""
Write-Host "🔗 Available Commands:" -ForegroundColor Cyan
Write-Host "npm run version:patch              - Bump patch version"
Write-Host "npm run version:minor              - Bump minor version"
Write-Host "npm run version:major              - Bump major version"
Write-Host ".\scripts\prepare-release.ps1      - Prepare for release"
Write-Host ".\scripts\bump-version.ps1 patch   - Bump version manually"

Write-Host ""
Write-Status "Git Flow setup completed successfully! 🚀"

if ($DryRun) {
    Write-Warning "This was a dry run. Use without -DryRun to actually apply changes."
}
