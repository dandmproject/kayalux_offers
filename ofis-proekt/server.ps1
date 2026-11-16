param([string]$Root = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "3d"))
$root = (Resolve-Path $Root).Path
$l = New-Object System.Net.HttpListener
try { $l.Prefixes.Add("http://+:5300/"); $l.Start() } catch { $l = New-Object System.Net.HttpListener; $l.Prefixes.Add("http://localhost:5300/"); $l.Start(); Write-Host "Samo za tozi kompyutar (za telefon pusnete kato Administrator)" }
Write-Host "Server na port 5300 raboti..."
$types = @{".html"="text/html; charset=utf-8";".js"="application/javascript";".jpg"="image/jpeg";".png"="image/png"}
while ($l.IsListening) {
  $c = $l.GetContext(); $p = $c.Request.Url.AbsolutePath.TrimStart('/'); if ($p -eq "") { $p = "index.html" }
  $f = Join-Path $root $p
  if ((Test-Path $f -PathType Leaf) -and ((Resolve-Path $f).Path.StartsWith($root))) {
    $b = [IO.File]::ReadAllBytes($f); $e = [IO.Path]::GetExtension($f).ToLower()
    if ($types[$e]) { $c.Response.ContentType = $types[$e] }
    $c.Response.OutputStream.Write($b,0,$b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
