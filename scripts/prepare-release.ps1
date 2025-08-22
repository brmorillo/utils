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
