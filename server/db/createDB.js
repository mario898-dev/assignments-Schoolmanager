// init-db.js
import sqlite3 from 'sqlite3';
sqlite3.verbose();

/* Apri (o crea) il file compiti.db */
const db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Impossibile aprire il DB:', err.message);
    process.exit(1);
  }
});

/* Schema minimale richiesto: niente indici, niente timestamp */
const schema = `
PRAGMA foreign_keys = ON;

-- 1. Utenti (docenti + studenti)
CREATE TABLE IF NOT EXISTS users (
  userID         INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT    NOT NULL,
  email          TEXT    NOT NULL UNIQUE,
  password_hash  TEXT    NOT NULL,
  role           TEXT    NOT NULL               -- 'teacher' | 'student'
);

-- 2. Compiti / Task
CREATE TABLE IF NOT EXISTS Tasks (
  taskID   INTEGER PRIMARY KEY AUTOINCREMENT,
  docID    INTEGER NOT NULL,                    -- docente che assegna
  question TEXT    NOT NULL,
  status   TEXT    NOT NULL CHECK (status IN ('open','closed')),
  FOREIGN KEY (docID) REFERENCES users(userID)
);

-- 3. Membri del gruppo per quel Task
CREATE TABLE IF NOT EXISTS task_Members (
  taskID    INTEGER NOT NULL,
  studentID INTEGER NOT NULL,
  PRIMARY KEY (taskID, studentID),
  FOREIGN KEY (taskID)    REFERENCES Tasks(taskID) ON DELETE CASCADE,
  FOREIGN KEY (studentID) REFERENCES users(userID)
);

-- 4. Risposta (una per Task)
CREATE TABLE IF NOT EXISTS answers (
  taskID      INTEGER PRIMARY KEY,
  answer_text TEXT NOT NULL,
  FOREIGN KEY (taskID) REFERENCES Tasks(taskID) ON DELETE CASCADE
);

-- 5. Valutazione (una per Task)
CREATE TABLE IF NOT EXISTS grades (
  taskID INTEGER PRIMARY KEY,
  score  INTEGER NOT NULL,
  FOREIGN KEY (taskID) REFERENCES Tasks(taskID) ON DELETE CASCADE
);

`;

/* Esegui lo script */
db.exec(schema, (err) => {
  if (err) {
    console.error('Errore nella creazione dello schema:', err.message);
  } else {
    console.log('Database inizializzato correttamente.');
  }
  db.close();
});
