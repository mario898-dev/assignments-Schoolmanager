import crypto from 'crypto';
import db from '../db/openDB.js';

export default function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
        if (err) return reject(err);

        const storedHash = Buffer.from(row.password_hash, 'hex');
        const match = crypto.timingSafeEqual(storedHash, hashedPassword);

        if (!match) return resolve(null);

        const user = { id: row.userID, email: row.email, name: row.name, role: row.role };

        resolve(user);
      });
    });
  });
}
