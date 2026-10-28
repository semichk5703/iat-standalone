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
#     otherwise opens each folder in your browser for you to use Drive's "Download all".
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
    $gdown = Get-Command gdown -ErrorAction SilentlyContinue
    if (-not $gdown) { Write-Host "   gdown not found (pip install gdown); opening folders in your browser instead - use Drive's 'Download all' into media\project-implicit\<name>" }
    $log = "media\project-implicit\fetch.log"
    New-Item -ItemType Directory -Force -Path media\project-implicit | Out-Null
    "fetch-media.ps1 run $(Get-Date -Format o)" | Set-Content $log
    $failed = @()
    foreach ($name in $sets.Keys) {
        $url = "https://drive.google.com/drive/folders/$($sets[$name])"
        $dest = "media\project-implicit\$name"
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        if (-not $gdown) { Start-Process $url; Start-Sleep -Seconds 2; continue }
        # gdown's full output (it names each file and the reason a download failed) goes to the log;
        # failures are retried, since Google Drive refuses individual files intermittently
        # ("Too many users have viewed or downloaded this file recently" / quota / virus-scan prompt).
        $ok = $false
        for ($attempt = 1; $attempt -le 3 -and -not $ok; $attempt++) {
            Write-Host "   $name (attempt $attempt)"
            "`n== $name attempt $attempt  $url" | Add-Content $log
            $out = & gdown --folder --continue -O $dest $url 2>&1 | Tee-Object -FilePath $log -Append
            if ($LASTEXITCODE -eq 0 -and -not ($out -match "Failed to download")) { $ok = $true }
            else { Start-Sleep -Seconds (20 * $attempt) }
        }
        if (-not $ok) { $failed += $name; Write-Host "   FAILED $name - see $log; fetch by hand: $url" }
    }
    if ($failed.Count) {
        Write-Host ""
        Write-Host "Some files could not be fetched. The log has gdown's reason per file: $log"
        Write-Host "Open the folder URL above in a browser and use Drive's 'Download all' into the set's folder."
        Write-Host "(Thumbs.db entries are Windows thumbnail caches left in the Drive folder; ignore them.)"
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
