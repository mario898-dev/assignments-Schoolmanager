import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import db from '../db/openDB.js';
import { User } from '../models/user.js';

export default class UserDAO {
  /**
   * Verifica se email+password sono validi
   */
  getIsUserAuthenticated(email, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT salt, password_hash FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(false);

        crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
          if (err) return reject(err);

          const storedHash = Buffer.from(row.password_hash, 'hex');
          const providedHash = hashedPassword;

          const match = crypto.timingSafeEqual(storedHash, providedHash);
          resolve(match);
        });
      });
    });
  }

  /**
   * Recupera l'oggetto utente per email
   */
  getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT userID, email, name, role FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      const user = new User(row.userID, row.email, row.name, row.role);
      resolve(user);
    });
  });
}

}
