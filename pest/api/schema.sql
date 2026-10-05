-- Подписи на оферти. Една таблица.
CREATE TABLE IF NOT EXISTS offer_signatures (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  offer_no VARCHAR(32) NOT NULL,
  signer_name VARCHAR(120) NOT NULL,
  mode VARCHAR(8) NOT NULL,
  total_eur DECIMAL(10,2) NOT NULL,
  signature_png MEDIUMBLOB NOT NULL,
  ip VARBINARY(16) NULL,
  user_agent VARCHAR(255) NULL,
  signed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_offer (offer_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
