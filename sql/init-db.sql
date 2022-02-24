-- database name is defined in ormconfig.json
CREATE DATABASE IF NOT EXISTS amazing;
-- the actual authentication data is defined in ormconfig.json
CREATE USER IF NOT EXISTS codescape IDENTIFIED BY "codescape";
GRANT ALL PRIVILEGES ON `amazing`.* TO 'codescape'@'%' IDENTIFIED BY "codescape";
