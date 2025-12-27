# Registers a Windows Scheduled Task to start the app at user logon

param(
    [string]$TaskName = "CustomerSegmentationAutoStart",
    [string]$Port = "5000"
)

$ErrorActionPreference = "Stop"

try {
    $script = Join-Path $PSScriptRoot "start_app.ps1"
    if (-not (Test-Path $script)) {
        throw "start_app.ps1 not found at $script"
    }

    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$script`" -Port $Port"
    $trigger = New-ScheduledTaskTrigger -AtLogOn

    # Create or update the task
    $existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existing) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    }

    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Description "Start Customer Segmentation app on user logon" -RunLevel LeastPrivilege | Out-Null
    Write-Host "Scheduled Task '$TaskName' registered. App will auto-start at logon on port $Port."
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
