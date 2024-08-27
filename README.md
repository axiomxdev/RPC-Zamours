# RPC-Zamours
Prérequis, (node version 20)[https://nodejs.org/en/download/prebuilt-installer], utilisé windows comme os

ensuite, executé powershell en mode admin et executé ce script d'installation :
```ps1
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Ce script doit être exécuté avec des privilèges administratifs. Relancez PowerShell en tant qu'administrateur."
    exit
}

if ($PSVersionTable.PSVersion.Major -lt 5 -or $env:OS -ne 'Windows_NT') {
    Write-Host "Ce script est conçu pour être exécuté sur Windows avec PowerShell 5.0 ou supérieur."
    exit
}

$repoUrl = "https://github.com/axiomxdev/RPC-Zamours/archive/refs/heads/main.zip"
$installDir = "C:\Program Files\RPC-Zamours"
$batchFile = "$installDir\RPC-Zamours-main\src\start-script.bat"
$desktopShortcut = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "Start RPC-Zamours.lnk")

if (-Not (Test-Path -Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir
}

Invoke-WebRequest -Uri $repoUrl -OutFile "$installDir\repo.zip"
Expand-Archive -Path "$installDir\repo.zip" -DestinationPath $installDir

cd "$installDir\RPC-Zamours-main\src"
npm run install

$file = "$installDir\RPC-Zamours-main\src\config.json"
$acl = Get-Acl $file
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("$env:UserName", "FullControl", "Allow")
$acl.SetAccessRule($rule)
Set-Acl $file $acl

$batchContent = "@echo off`ncd %~dp0`nnpm run start"
Set-Content -Path $batchFile -Value $batchContent

$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($desktopShortcut)
$Shortcut.TargetPath = $batchFile
$Shortcut.Save()

Write-Host "Installation terminée. Vous pouvez lancer le script avec le raccourci sur le bureau."```

Maintenant, vous pouvez faire de belle invitation sur ce beau serveur français.
