$ErrorActionPreference = 'Stop'
$sites = (Get-Content 'data/building-link-audit.json' -Raw | ConvertFrom-Json).unresolved
$results = @()
foreach ($site in $sites) {
    $geometry = $site.coordinates -join ','
    $url = 'https://gis.memphistn.gov/server/rest/services/Parcel/CERT_TAX_PARCELS/FeatureServer/0/query?f=json&geometry=' + $geometry + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=PARCELID,PAR_ADRNO,PAR_ADDR1,LANDUSE&returnGeometry=true&outSR=4326'
    $reply = Invoke-RestMethod -Uri $url -TimeoutSec 20
    $results += @{key=$site.key;requested=$site.address;source=$url;features=$reply.features}
}
$results | ConvertTo-Json -Depth 20 | Set-Content 'data/site-parcels.json'
$results | ForEach-Object { [pscustomobject]@{key=$_.key;requested=$_.requested;parcel=($_.features.attributes.PAR_ADDR1 -join '; ')} } | Format-Table -AutoSize
