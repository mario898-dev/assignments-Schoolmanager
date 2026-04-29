import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/database.db', err => {
  if (err) throw err;
  db.run('PRAGMA foreign_keys = ON');
});

export default db;
