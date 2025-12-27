# Starts the Customer Segmentation Analytics System
# Run manually or via Scheduled Task after login

param(
    [string]$Port = "5000"
)

try {
    $ErrorActionPreference = "Stop"

    # Resolve project root (this script lives in config/windows)
    $root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
    Write-Host "Project root:" $root.Path

    # Ensure firewall rule for inbound TCP on port
    $ruleName = "CustomerSegmentation-$Port"
    if (-not (Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow | Out-Null
        Write-Host "Firewall rule added for port $Port"
    }

    # Verify Python availability
    $python = Get-Command python -ErrorAction SilentlyContinue
    if (-not $python) {
        Write-Error "Python not found in PATH. Please install Python and ensure 'python' is available."
        exit 1
    }

    # Optionally verify dependencies (non-blocking)
    try {
        Write-Host "Verifying dependencies..."
        & python (Join-Path $root.Path "src\verify_requirements.py") | Out-String | Write-Host
    } catch {
        Write-Warning "Dependency verification failed or reported issues. Continuing to start app."
    }

    # Set env vars
    $env:FLASK_DEBUG = "False"
    $env:SERVER_PORT = $Port

    # Start the app hidden/minimized
    $appPath = Join-Path $root.Path "src\app.py"
    Write-Host "Starting app on port $Port..."
    Start-Process -FilePath "python" -ArgumentList "`"$appPath`"" -WorkingDirectory $root.Path -WindowStyle Minimized
    Write-Host "App start invoked. Check http://localhost:$Port/health"
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
