<?php
// Приема подписа от страницата, записва го в MySQL и праща имейл до KAYA LUX.
// Настрой четирите константи по-долу (cPanel → MySQL Databases) и адреса за имейл.
// Ако таблицата липсва, изпълни schema.sql в phpMyAdmin.
declare(strict_types=1);
const DB_HOST='localhost'; const DB_NAME='CPANELUSER_offers'; const DB_USER='CPANELUSER_offers'; const DB_PASS='ПАРОЛА';
const MAIL_TO='scent@kayalux.bg'; const OFFER_NO='2026-148-A';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
$raw = file_get_contents('php://input', false, null, 0, 600000);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) { http_response_code(400); echo '{"ok":false,"err":"bad json"}'; exit; }
$name = trim((string)($in['name'] ?? '')); $mode = (string)($in['mode'] ?? ''); $total = (float)($in['total'] ?? 0); $png = (string)($in['png'] ?? '');
if ($name === '' || !in_array($mode, ['std','full'], true) || strpos($png, 'data:image/png;base64,') !== 0) { http_response_code(400); echo '{"ok":false,"err":"missing fields"}'; exit; }
$bin = base64_decode(substr($png, 22), true);
if ($bin === false || strlen($bin) < 200 || strlen($bin) > 400000 || substr($bin, 0, 8) !== "\x89PNG\r\n\x1a\n") { http_response_code(400); echo '{"ok":false,"err":"bad png"}'; exit; }

try {
  $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $st = $pdo->prepare('INSERT INTO offer_signatures (offer_no, signer_name, mode, total_eur, signature_png, ip, user_agent) VALUES (?,?,?,?,?,?,?)
                       ON DUPLICATE KEY UPDATE signer_name=VALUES(signer_name), mode=VALUES(mode), total_eur=VALUES(total_eur), signature_png=VALUES(signature_png), ip=VALUES(ip), user_agent=VALUES(user_agent), signed_at=CURRENT_TIMESTAMP');
  $st->execute([OFFER_NO, mb_substr($name,0,120), $mode, $total, $bin, @inet_pton($_SERVER['REMOTE_ADDR'] ?? '') ?: null, mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''),0,255)]);
} catch (Throwable $e) { http_response_code(500); echo '{"ok":false,"err":"db"}'; exit; }

// имейл с подписа като прикачен файл
$boundary = 'b'.bin2hex(random_bytes(12));
$when = date('d.m.Y H:i');
$modeName = $mode === 'full' ? 'Пълно работно време' : 'Стандартен режим';
$body = "Офертата № ".OFFER_NO." е подписана.\r\n\r\nПодписал: $name\r\nРежим: $modeName\r\nМесечно: ".number_format($total,2,',',' ')." € без ДДС\r\nДата: $when\r\nIP: ".($_SERVER['REMOTE_ADDR'] ?? '')."\r\n";
$msg  = "--$boundary\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$body\r\n";
$msg .= "--$boundary\r\nContent-Type: image/png; name=\"podpis-".OFFER_NO.".png\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"podpis-".OFFER_NO.".png\"\r\n\r\n".chunk_split(base64_encode($bin))."\r\n--$boundary--";
$headers = "From: KAYA LUX оферти <no-reply@".($_SERVER['SERVER_NAME'] ?? 'kayalux.bg').">\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$boundary\"";
$sent = @mail(MAIL_TO, '=?UTF-8?B?'.base64_encode('Подписана оферта '.OFFER_NO.' · '.$name).'?=', $msg, $headers);
echo json_encode(['ok'=>true,'mailed'=>(bool)$sent,'at'=>$when], JSON_UNESCAPED_UNICODE);
