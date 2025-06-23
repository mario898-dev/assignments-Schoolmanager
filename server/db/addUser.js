// add-user.js
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('database.db', (err) => {
  if (err) throw err;
  db.run('PRAGMA foreign_keys = ON');
});

function addUser(name, email, password, role) {
  const salt = crypto.randomBytes(16).toString('hex');

  crypto.scrypt(password, salt, 16, (err, hashedPassword) => {
    if (err) throw err;

    const password_hash = hashedPassword.toString('hex');

    const sql = `
      INSERT INTO users (name, email, password_hash, salt, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [name, email, password_hash, salt, role], function (err) {
      if (err) {
        console.error('Errore:', err.message);
      } else {
        console.log(`Utente inserito con ID ${this.lastID}`);
      }
      db.close();
    });
  });
}

// ESEMPIO: modifica i valori qui sotto
addUser('Mario', 'mario@exam.com', 'p123', 'teacher');
addUser('Luigi', 'luigi@exam.com', 'p456', 'student');
