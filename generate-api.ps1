<#
.SYNOPSIS
    Fetches OpenAPI docs and generates a TypeScript API client per source.

.DESCRIPTION
    This script automates the API generation pipeline using a "generate-per-source" approach. 
    It fetches multiple OpenAPI specs, creates a unique, deterministic client name, 
    and outputs one dedicated client folder per API.

.EXAMPLE
    .\generate-api.ps1
    Runs the pipeline using the default paths.

.EXAMPLE
    .\generate-api.ps1 -FetchConfig ".\custom-config.json" -TsOutput ".\clients"
    Runs the pipeline but overrides the config file and output directory.
#>

param (
    [string]$FetchConfig = ".\scripts\config.json",
    [string]$TsOutput = ".\clients\"
)

# Stop the script if any command fails
$ErrorActionPreference = "Stop"

function Get-ClientName {
    param([string]$Title)
    $parts = $Title -split '[^a-zA-Z0-9]+' | Where-Object { $_ -ne '' }
    if ($parts.Count -eq 0) { return "defaultClient" }
    
    $first = $parts[0]
    $first = $first.Substring(0,1).ToLower() + $first.Substring(1)
    
    $rest = @()
    if ($parts.Count -gt 1) {
        foreach ($p in $parts[1..($parts.Count-1)]) {
            $rest += $p.Substring(0,1).ToUpper() + $p.Substring(1)
        }
    }
    
    $camel = $first + ($rest -join '')
    if ($camel -notmatch "(?i)client$") {
        $camel += "Client"
    }
    return $camel
}

Write-Host "Starting API Generation Process (Per-Source)..." -ForegroundColor Cyan

try {
    # Read config.json
    if (-not (Test-Path $FetchConfig)) { throw "Config file not found at $FetchConfig" }
    $configContent = Get-Content -Path $FetchConfig -Raw | ConvertFrom-Json
    
    $hostName = $configContent.host
    if (-not $hostName) { $hostName = "http://localhost" }
    $pathTemplate = $configContent.path_template
    if (-not $pathTemplate) { $pathTemplate = "/v3/api-docs" }
    
    # Resolve absolute paths
    $configDir = Split-Path -Parent (Resolve-Path $FetchConfig)
    $outputDir = Join-Path $configDir $configContent.output_dir
    
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    }

    foreach ($port in $configContent.ports) {
        $url = "${hostName}:${port}${pathTemplate}"
        $outputFile = Join-Path $outputDir "${port}.swagger.json"
        
        Write-Host "`n[START] Processing source for port $port" -ForegroundColor Yellow
        Write-Host "  -> Fetching $url" -ForegroundColor DarkGray
        
        try {
            Invoke-RestMethod -Uri $url -Method Get -OutFile $outputFile -TimeoutSec $configContent.timeout_seconds
            Write-Host "     Saved to $outputFile" -ForegroundColor DarkGray
        } catch {
            Write-Host "  -> Failed to fetch from $url : $_" -ForegroundColor Red
            throw "Failed to fetch from $url"
        }

        # Extract title and determine client name
        $swaggerObj = Get-Content -Path $outputFile -Raw | ConvertFrom-Json
        $title = $swaggerObj.info.title
        if (-not $title) { $title = "$port" }
        
        $clientName = Get-ClientName -Title $title
        
        if (-not (Test-Path $TsOutput)) {
            New-Item -ItemType Directory -Force -Path $TsOutput | Out-Null
        }
        $clientDir = Join-Path (Resolve-Path $TsOutput).Path $clientName
        
        # Idempotency: clear existing client directory
        if (Test-Path $clientDir) {
            Remove-Item -Path $clientDir -Recurse -Force
        }
        New-Item -ItemType Directory -Force -Path $clientDir | Out-Null
        
        Write-Host "  -> Generating $clientName..." -ForegroundColor DarkGray
        
        # Invoke generator
        $npxCmd = "npx"
        if ($env:OS -match "Windows_NT") { $npxCmd = "npx.cmd" }
        
        $proc = Start-Process -FilePath $npxCmd -ArgumentList "swagger-typescript-api", "generate", "--path", "`"$outputFile`"", "--output", "`"$clientDir`"", "--modular" -NoNewWindow -Wait -PassThru
        $exitCode = $proc.ExitCode
        Write-Host "  -> Generator exit code: $exitCode" -ForegroundColor DarkGray
        
        if ($exitCode -ne 0) { 
            throw "swagger-typescript-api exited with code $exitCode" 
        }
        
        # Format output to index.ts, models.ts, apis.ts
        if (Test-Path "$clientDir\data-contracts.ts") {
            Rename-Item "$clientDir\data-contracts.ts" "models.ts"
        }
        if (Test-Path "$clientDir\Api.ts") {
            $apiContent = Get-Content "$clientDir\Api.ts" -Raw
            $apiContent = $apiContent -replace 'from "\./data-contracts"', 'from "./models"'
            Set-Content "$clientDir\apis.ts" -Value $apiContent
            Remove-Item "$clientDir\Api.ts"
        }
        
        # Create index.ts
        $indexContent = "export * from `"./models`";`nexport * from `"./apis`";`n"
        if (Test-Path "$clientDir\http-client.ts") {
            $indexContent += "export * from `"./http-client`";`n"
        }
        Set-Content "$clientDir\index.ts" -Value $indexContent
        
        # Create README with baseUrl
        $baseUrl = "N/A"
        if ($swaggerObj.servers -and $swaggerObj.servers.Count -gt 0) {
            $baseUrl = $swaggerObj.servers[0].url
        }
        $readmeContent = "# $clientName`n`nBase URL: $baseUrl`n"
        Set-Content "$clientDir\README.md" -Value $readmeContent
        
        Write-Host "[END] Finished processing $clientName successfully" -ForegroundColor Green
    }

    Write-Host "`nAPI Generation completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "`nError during API generation: $_" -ForegroundColor Red
    exit 1
}
