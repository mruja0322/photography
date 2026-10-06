# Optional local preview server for this static site.
# Use it when you want to see the page over http:// instead of opening index.html directly.
#
#   powershell -ExecutionPolicy Bypass -File serve.ps1
#   powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 9000
#
# Then open http://127.0.0.1:8788/ in your browser.

param([int]$Port = 8788)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Serving $root on http://127.0.0.1:$Port/  (Ctrl+C to stop)"

$types = @{
  '.html' = 'text/html'; '.css' = 'text/css'; '.js' = 'application/javascript'
  '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.png' = 'image/png'
  '.webp' = 'image/webp'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = $ctx.Request.Url.LocalPath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }

  $file = Join-Path $root $path
  if (Test-Path $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
