$ErrorActionPreference = 'Stop'

Write-Host "Starting replacement of @midscene/ with @sqaitech/..." -ForegroundColor Cyan

# Get all TypeScript and JavaScript files
$files = Get-ChildItem -Path . -Include *.ts,*.tsx,*.js,*.mjs,*.cjs -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/]node_modules[\\/]' -and
    $_.FullName -notmatch '[\\/]dist[\\/]' -and
    $_.FullName -notmatch '[\\/]\.next[\\/]' -and
    $_.FullName -notmatch '[\\/]extension_output[\\/]' -and
    $_.FullName -notmatch '[\\/]doc_build[\\/]' -and
    $_.FullName -notmatch '[\\/]build[\\/]' -and
    $_.FullName -notmatch '[\\/]\.git[\\/]'
}

$totalReplacements = 0
$filesUpdated = 0
$processedFiles = @()

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction Stop
        
        if ($null -ne $content -and $content -match '@midscene/') {
            $newContent = $content -replace '@midscene/', '@sqaitech/'
            $matches = ([regex]::Matches($content, '@midscene/')).Count
            $totalReplacements += $matches
            $filesUpdated++
            
            # Write the updated content back to the file
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline -ErrorAction Stop
            
            $processedFiles += $file.FullName
            Write-Host "Updated: $($file.FullName) ($matches replacements)" -ForegroundColor Green
        }
    }
    catch {
        Write-Warning "Error processing $($file.FullName): $_"
    }
}

Write-Host "`n===============================================" -ForegroundColor Yellow
Write-Host "Replacement Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow
Write-Host "Files Updated: $filesUpdated" -ForegroundColor Cyan
Write-Host "Total Replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Yellow
