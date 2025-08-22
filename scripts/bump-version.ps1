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
