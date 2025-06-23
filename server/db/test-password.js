import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const email = 'mario@exam.com';
const passwordToTest = '123456'; // 🔁 prova con la password che credi di aver usato

const db = new sqlite3.Database('./database.db');

db.get('SELECT password_hash, salt FROM users WHERE email = ?', [email], (err, row) => {
  if (err) throw err;
  if (!row) {
    console.log('❌ Utente non trovato.');
    return;
  }

  const { password_hash, salt } = row;

  crypto.scrypt(passwordToTest, salt, 16, (err, derivedKey) => {
    if (err) throw err;

    const hashed = derivedKey.toString('hex');

    if (hashed === password_hash) {
      console.log('✅ La password combacia. Login funzionerebbe.');
    } else {
      console.log('❌ Password errata. Hash non coincide.');
      console.log('Hash calcolato: ', hashed);
      console.log('Hash salvato:   ', password_hash);
    }

    db.close();
  });
});
