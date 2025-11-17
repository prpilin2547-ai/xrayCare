# Git reset and push to HTTPS remote
# This script:
# 1. Backs up existing .git (if present)
# 2. Initializes a fresh git repo
# 3. Adds all files (respecting .gitignore)
# 4. Creates an initial commit
# 5. Sets HTTPS remote to https://github.com/prpilin2547-ai/xrayCare.git
# 6. Force-pushes to replace remote history

$projectPath = 'C:\test4'
$remoteUrl = 'https://github.com/prpilin2547-ai/xrayCare.git'

Set-Location $projectPath
Write-Output "Working directory: $(Get-Location)"

# Backup existing .git if present
if (Test-Path .git) {
  $ts = Get-Date -Format 'yyyyMMddHHmmss'
  $backupName = ".git_backup_$ts"
  Rename-Item -Path .git -NewName $backupName
  Write-Output "[✓] Backed up existing .git to $backupName"
} else {
  Write-Output "[✓] No existing .git found"
}

# Initialize new repo
Write-Output "[→] Initializing fresh git repo..."
git init
if ($LASTEXITCODE -ne 0) { Write-Error "git init failed"; exit 1 }
Write-Output "[✓] Git repo initialized"

# Configure user (if not set globally)
$userName = git config user.name
$userEmail = git config user.email
if (-not $userName) {
  Write-Output "[→] Setting git user config..."
  git config user.name "xRayCare User"
  git config user.email "noreply@xraycare.local"
}

# Add all files (node_modules ignored by .gitignore)
Write-Output "[→] Adding files (respecting .gitignore)..."
git add .
if ($LASTEXITCODE -ne 0) { Write-Error "git add failed"; exit 1 }
Write-Output "[✓] Files added"

# Create initial commit
Write-Output "[→] Creating initial commit..."
git commit -m "Initial commit (history reset)" 2>&1
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 1) { 
  Write-Error "git commit failed with code $LASTEXITCODE"
  exit 1
}
Write-Output "[✓] Initial commit created"

# Remove old remote if exists
git remote remove origin 2>$null
Write-Output "[✓] Old remote removed (if any)"

# Add new HTTPS remote
Write-Output "[→] Adding remote: $remoteUrl"
git remote add origin $remoteUrl
if ($LASTEXITCODE -ne 0) { Write-Error "git remote add failed"; exit 1 }
Write-Output "[✓] Remote added"

# Ensure main branch
Write-Output "[→] Setting branch to main..."
git branch -M main
if ($LASTEXITCODE -ne 0) { Write-Error "git branch -M main failed"; exit 1 }
Write-Output "[✓] Branch is main"

# Force push to replace remote history
Write-Output "[→] Force-pushing to $remoteUrl (main branch)..."
Write-Output "    Note: You may be prompted for authentication in a browser or via git credentials."
git push -u origin main --force
if ($LASTEXITCODE -ne 0) { 
  Write-Error "git push --force failed. Check authentication and remote URL."
  exit 1
}
Write-Output "[✓] Force-push complete!"

Write-Output ""
Write-Output "=========================================="
Write-Output "Git reset and push completed successfully!"
Write-Output "=========================================="
Write-Output "Remote URL: $remoteUrl"
Write-Output "Branch: main"
Write-Output "Status: Ready to use"
Write-Output ""
