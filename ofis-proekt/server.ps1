# Ofis 3D server on port 5300. Keeps running; restarts itself after any error.
param([string]$Root = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "3d"), [int]$Port = 5300)
$root = (Resolve-Path $Root).Path
$log = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "server.log"
function Log($m){ $t="$(Get-Date -f s) $m"; Write-Host $t; try { Add-Content -Path $log -Value $t } catch { } }
Log "Start, folder: $root"
$types = @{".html"="text/html; charset=utf-8";".js"="application/javascript";".svg"="image/svg+xml";".jpg"="image/jpeg";".png"="image/png";".css"="text/css"}
while ($true) {
  $l = New-Object System.Net.HttpListener
  try {
    try { $l.Prefixes.Add("http://+:$Port/"); $l.Start() }
    catch { $l = New-Object System.Net.HttpListener; $l.Prefixes.Add("http://localhost:$Port/"); $l.Start(); Log "Only this PC (run as Administrator for phones)" }
    Log "Listening: http://localhost:$Port/"
    while ($l.IsListening) {
      $c = $l.GetContext()
      try {
        $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
        if ($p -eq "" -or $p.EndsWith("/")) { $p = $p + "index.html" }
        $f = [IO.Path]::GetFullPath((Join-Path $root $p))
        if ($f.StartsWith($root) -and (Test-Path $f -PathType Leaf)) {
          $b = [IO.File]::ReadAllBytes($f); $e = [IO.Path]::GetExtension($f).ToLower()
          if ($types[$e]) { $c.Response.ContentType = $types[$e] }
          $c.Response.Headers.Add("Cache-Control","no-cache")
          $c.Response.OutputStream.Write($b,0,$b.Length)
        } else { $c.Response.StatusCode = 404 }
      } catch { } finally { try { $c.Response.Close() } catch { } }
    }
  } catch { Log "Error, restarting: $($_.Exception.Message)" }
  try { $l.Close() } catch { }
  Start-Sleep -Seconds 3
}
