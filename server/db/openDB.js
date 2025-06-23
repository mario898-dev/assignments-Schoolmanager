import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('/Users/mariodepaola/Documents/GitHub/esame2-compiti-Mari0-web/server/db/database.db', err => {
  if (err) throw err;
  db.run('PRAGMA foreign_keys = ON');
});

export default db;
