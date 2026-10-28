$ErrorActionPreference = 'Stop'
$sites = Get-Content 'data/site-locations.json' -Raw | ConvertFrom-Json
$results = @()
foreach ($site in $sites) {
    $normalized = ($site.address -replace '\s*\(.*\)$','') -replace 'E\. E\.H\. Crump','E EH Crump'
    $address = [uri]::EscapeDataString($normalized + ', Memphis, TN')
    $url = 'https://gis.memphistn.gov/server/rest/services/Geocode/Locator_MemphisCityLimits/GeocodeServer/findAddressCandidates?f=json&SingleLine=' + $address + '&outSR=4326&outFields=*&locationType=rooftop'
    $reply = Invoke-RestMethod -Uri $url -TimeoutSec 20
    $results += @{key=$site.key; requested=$site.address; source=$url; candidates=$reply.candidates}
}
$results | ConvertTo-Json -Depth 15 | Set-Content 'data/address-candidates.json'
$results | ForEach-Object { $best = $_.candidates | Select-Object -First 1; [pscustomobject]@{key=$_.key; score=$best.score; type=$best.attributes.Addr_type; address=$best.address; lon=$best.location.x; lat=$best.location.y} } | Format-Table -AutoSize
