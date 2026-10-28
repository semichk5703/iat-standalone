# fetch-media.ps1 — download IAT stimulus media on Windows (PowerShell 5+), for copying to the offline machine.
#
#   powershell -ExecutionPolicy Bypass -File fetch-media.ps1            # everything
#   powershell -ExecutionPolicy Bypass -File fetch-media.ps1 -Only pi   # only Project Implicit sets
#
# Two sources:
#  1. minno-tasks (Project Implicit's open task library, Apache-2.0): a plain git-archive download.
#     These are the images the stimuli/*.txt files already reference. The bundle ships them in media/minno/,
#     so this step only matters if you want to refresh or re-derive them.
#  2. Project Implicit "Study Materials" (projectimplicit.net/resources/study-materials/): the lab's own
#     stimulus sets, hosted as Google Drive folders, "made available for academic research purposes";
#     they ask that you cite Nosek et al. (2007), Eur. Rev. Soc. Psych. 18, 36-88.  Google Drive folders
#     have no stable direct-download URL, so this script uses gdown (pip install gdown) when present and
#     otherwise prints each folder's URL for you to use Drive's "Download all".
#     Re-running only fetches files still missing (see fetch-drive-missing.py).
# Output: .\media\minno\  and  .\media\project-implicit\<set>\ — copy the media\ folder next to the iat binary.
param([string]$Only = "all")
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
New-Item -ItemType Directory -Force -Path media | Out-Null

if ($Only -in "all","minno") {
    Write-Host "== minno-tasks images"
    $zip = Join-Path $env:TEMP "minno-tasks.zip"
    Invoke-WebRequest -Uri "https://github.com/baranan/minno-tasks/archive/refs/heads/master.zip" -OutFile $zip
    $tmp = Join-Path $env:TEMP "minno-tasks-src"
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    Expand-Archive -Path $zip -DestinationPath $tmp
    New-Item -ItemType Directory -Force -Path media\minno | Out-Null
    Copy-Item (Join-Path $tmp "minno-tasks-master\docs\images\*") media\minno\ -Force
    Copy-Item (Join-Path $tmp "minno-tasks-master\LICENSE") media\minno\LICENSE-minno-tasks-Apache-2.0 -Force
    Write-Host ("   {0} files -> media\minno" -f (Get-ChildItem media\minno).Count)
}

if ($Only -in "all","pi") {
    Write-Host "== Project Implicit study materials (Google Drive)"
    # folder ids from https://www.projectimplicit.net/resources/study-materials/ (checked 2026-10)
    $sets = [ordered]@{
        "race-faces"            = "1DO9wj31RgoXB7d03kBNPu8_RKVq58Lyx"   # 6 Black + 6 white morphed faces
        "age-faces"             = "1Zj494ShalPWhloGnu_p6uRgUJklpk8qR"   # 6 young + 6 old
        "weight-faces"          = "1eQ99B_X4ULzuBpQ_5mU9l59cD2VFLLbn"   # 10 heavy + 10 thin
        "skin-tone"             = "1-2AfwG80LSM6PrNHUbPJmhJ9WEL6Eb2t"   # current set
        "disability-drawings"   = "1aH3Wu6ecCsZv8OYoCTpEAbjCySgCaMP0"   # 6 abled + 6 disabled line drawings
        "sexuality-figurines"   = "1LznT60HZvz7GwmzBsennL0-jJ1IGwU30"
        "religion"              = "1Nu5FuzuQta4_G1-kPGfMxbQ4HKCVPR0B"
        "weapons-original"      = "1u_o497ewIhOpodGamA6TxBZiISjID2aD"   # 7 weapons + 7 harmless objects
        "weapons-new"           = "1rCul6saF9A1xn5FaGSr0v5FgTyeCX7Ty"
        "presidents"            = "17hvKdDq1F4a3OybJBlizldcZYkUX1bI5"
        "asian-white-landmarks" = "1Hk-uzguS1aKBs9q-4gVzsE4nH68wvBVa"
        "child-race"            = "1Nj2JFe9E_yiefHYbajYXRiMnfje2ReWT"
    }
    # Downloads go through fetch-drive-missing.py (gdown's Python API): one listing request per set, then
    # only files not already on disk, so re-running after a rate limit or an interrupted run costs Drive
    # almost nothing. Each failure is printed with the file name and gdown's reason.
    $python = Get-Command python -ErrorAction SilentlyContinue
    $haveGdown = $false
    if ($python) {
        # -ArgumentList is joined with spaces and NOT quoted, so arguments containing spaces must carry their own quotes
        $probe = Start-Process -FilePath $python.Source -ArgumentList '-c "import gdown"' -NoNewWindow -Wait -PassThru
        $haveGdown = ($probe.ExitCode -eq 0)
    }
    if (-not $haveGdown) { Write-Host "   python + gdown not found (pip install gdown). Folder URLs are listed below; open each in a browser and use Drive's 'Download all' into media\project-implicit\<name>" }
    $log = "media\project-implicit\fetch.log"
    New-Item -ItemType Directory -Force -Path media\project-implicit | Out-Null
    "fetch-media.ps1 run $(Get-Date -Format o)" | Add-Content $log
    $failed = @()
    foreach ($name in $sets.Keys) {
        $url = "https://drive.google.com/drive/folders/$($sets[$name])"
        $dest = "media\project-implicit\$name"
        if (-not $haveGdown) { Write-Host "   $name  $url"; continue }
        Write-Host "   $name"
        # Start-Process with file redirection: under $ErrorActionPreference=Stop, PowerShell 5 turns any
        # stderr line of a native command run with 2>&1 into a terminating error.
        $so = Join-Path $env:TEMP "fetch-out.txt"
        $se = Join-Path $env:TEMP "fetch-err.txt"
        $argLine = "fetch-drive-missing.py `"$url`" `"$dest`""
        $p = Start-Process -FilePath $python.Source -ArgumentList $argLine -NoNewWindow -Wait -PassThru -RedirectStandardOutput $so -RedirectStandardError $se
        $out = (Get-Content $so -Raw -ErrorAction SilentlyContinue) + (Get-Content $se -Raw -ErrorAction SilentlyContinue)
        "`n== $name  $url" | Add-Content $log; $out | Add-Content $log
        Write-Host (($out -replace "`r", "`n") -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { "      $_" } | Out-String)
        if ($p.ExitCode -ne 0) { $failed += $name }
    }
    if ($failed.Count) {
        Write-Host ""
        Write-Host "Incomplete sets: $($failed -join ', ')   (full output: $log)"
        Write-Host "'Failed to retrieve file url' / 'Too many users' means Google Drive is rate-limiting these files;"
        Write-Host "it clears in hours to a day. Re-run then: files already on disk are not requested again."
        Write-Host "Or open the set's folder URL in a browser and use Drive's 'Download all' into its folder."
    }
    @"
Project Implicit stimulus sets, downloaded from https://www.projectimplicit.net/resources/study-materials/
Made available by Project Implicit for academic research purposes. Please cite:
Nosek, B. A., Smyth, F. L., Hansen, J. J., Devos, T., Lindner, N. M., Ranganath, K. A., ... & Banaji, M. R. (2007).
Pervasiveness and correlates of implicit attitudes and stereotypes. European Review of Social Psychology, 18, 36-88.
Any .zip inside a set folder should be extracted in place; then point a stimuli file at it, e.g.
    target_a_items: ../media/project-implicit/race-faces/*.jpg
"@ | Set-Content media\project-implicit\README.txt
}
Write-Host "done. Copy the media\ folder next to the iat binary on the offline machine (zips inside sets: extract in place)."