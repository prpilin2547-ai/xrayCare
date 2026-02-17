# เปิดพอร์ต 5173 ใน Windows Firewall เพื่อให้เครื่องอื่นในเครือข่ายเข้าแอปได้
# ต้องรัน PowerShell เป็นผู้ดูแลระบบ (Run as Administrator)

$ruleName = "Vite Dev 5173"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "กฎ Firewall '$ruleName' มีอยู่แล้ว"
} else {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
    Write-Host "เพิ่มกฎ Firewall สำหรับพอร์ต 5173 เรียบร้อย"
}
Write-Host ""
Write-Host "จากเครื่องอื่นใน Wi-Fi เดียวกัน เปิดเบราว์เซอร์ที่:"
Write-Host "  http://<IP-เครื่องนี้>:5173"
Write-Host "  (Check ipconfig or npm run dev output for Network URL)"
