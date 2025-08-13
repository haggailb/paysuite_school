// accountCrypto.js
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf8'); // 16 bytes

// 🔐 Encrypts the given plaintext (e.g. account number)
function encrypt(plaintext) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return {
    encryptedData: encrypted.toString('hex'),
    authTag: tag.toString('hex')
  };
}

// 🔓 Decrypts the encrypted account number
function decrypt(encryptedData, authTag) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

// 🧩 Hashes the account number for lookup
function hash(plaintext) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

module.exports = {
  encrypt,
  decrypt,
  hash
};
