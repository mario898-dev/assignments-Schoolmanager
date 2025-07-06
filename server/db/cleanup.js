const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    return console.error('Errore di connessione:', err.message);
  }
  console.log('Connessione al database riuscita.');
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = OFF');

  db.run('DELETE FROM task_Members', function (err) {
    if (err) return console.error('Errore pulizia task_Members:', err.message);
    console.log('Tabella task_Members pulita.');
  });

  db.run('DELETE FROM Tasks', function (err) {
    if (err) return console.error('Errore pulizia Tasks:', err.message);
    console.log('Tabella Tasks pulita.');
  });

  db.run('PRAGMA foreign_keys = ON');
});

db.close((err) => {
  if (err) {
    return console.error('Errore in chiusura DB:', err.message);
  }
  console.log('Connessione al database chiusa.');
});
