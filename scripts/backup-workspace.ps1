#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Backup SQAI workspace with only essential files (excluding node_modules, build outputs, etc.)

.DESCRIPTION
    Creates a clean copy of the workspace suitable for transferring to another machine.
    Excludes: node_modules, dist, .nx cache, runtime artifacts, git history, and logs.

.PARAMETER Destination
    The destination path where the backup will be created.
    Default: Creates 'sqai-workspace-backup' in the parent directory.

.PARAMETER IncludeGit
    Include .git directory (version control history). Default: false

.EXAMPLE
    .\scripts\backup-workspace.ps1 -Destination "D:\backup"
    
.EXAMPLE
    .\scripts\backup-workspace.ps1 -Destination "D:\backup" -IncludeGit
#>

param(
    [string]$Destination = "",
    [switch]$IncludeGit = $false
)

# Get workspace root (parent of scripts folder)
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$WorkspaceName = Split-Path -Leaf $WorkspaceRoot

# Set default destination if not provided
if ([string]::IsNullOrEmpty($Destination)) {
    $ParentDir = Split-Path -Parent $WorkspaceRoot
    $Destination = Join-Path $ParentDir "sqai-workspace-backup"
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SQAI Workspace Backup Utility" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source:      $WorkspaceRoot" -ForegroundColor Yellow
Write-Host "Destination: $Destination" -ForegroundColor Yellow
Write-Host ""

# Directories to exclude
$ExcludeDirs = @(
    'node_modules',
    '.nx',
    'dist',
    'dist-inspect',
    '.sqai',
    'midscene_run',
    '__pycache__',
    '.pytest_cache',
    'coverage',
    '.turbo'
)

# Add .git to exclude list if not including it
if (-not $IncludeGit) {
    $ExcludeDirs += '.git'
}

# File patterns to exclude
$ExcludeFiles = @(
    '*.log',
    '*.tgz',
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini'
)

Write-Host "Excluded directories:" -ForegroundColor Gray
foreach ($dir in $ExcludeDirs) {
    Write-Host "  - $dir" -ForegroundColor DarkGray
}
Write-Host ""

# Create destination if it doesn't exist
if (-not (Test-Path $Destination)) {
    Write-Host "Creating destination directory..." -ForegroundColor Green
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Build robocopy command
$ExcludeDirArgs = $ExcludeDirs | ForEach-Object { "/XD", $_ }
$ExcludeFileArgs = $ExcludeFiles | ForEach-Object { "/XF", $_ }

$RobocopyArgs = @(
    $WorkspaceRoot,
    $Destination,
    '/E',           # Copy subdirectories including empty ones
    '/NFL',         # No file list (less verbose)
    '/NDL',         # No directory list
    '/NJH',         # No job header
    '/NJS',         # No job summary
    '/R:2',         # Retry 2 times on failed copies
    '/W:3'          # Wait 3 seconds between retries
) + $ExcludeDirArgs + $ExcludeFileArgs

Write-Host "Starting backup..." -ForegroundColor Green
Write-Host ""

# Run robocopy
$result = & robocopy @RobocopyArgs

# Robocopy exit codes: 0-7 are success, 8+ are errors
$exitCode = $LASTEXITCODE
if ($exitCode -lt 8) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  Backup completed successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Location: $Destination" -ForegroundColor Cyan
    Write-Host ""
    
    # Calculate size
    $size = (Get-ChildItem -Path $Destination -Recurse -ErrorAction SilentlyContinue | 
             Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Total size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To use on target machine:" -ForegroundColor Yellow
    Write-Host "  1. Copy the backup folder to target machine" -ForegroundColor White
    Write-Host "  2. cd to the workspace directory" -ForegroundColor White
    Write-Host "  3. Run: pnpm install" -ForegroundColor White
    Write-Host "  4. Run: pnpm nx run-many -t build --all" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "  Backup failed with errors!" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Exit code: $exitCode" -ForegroundColor Red
    Write-Host "Check the output above for details." -ForegroundColor Red
    exit 1
}
