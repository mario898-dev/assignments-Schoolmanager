// db/add-user.js
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) throw err;
  db.run('PRAGMA foreign_keys = ON');
});

let total = 0;
let done = 0;

function addUser(name, email, password, role) {
  total++;

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
        console.error(`Errore inserendo ${email}:`, err.message);
      } else {
        console.log(`✔ Inserito: ${email} (ID ${this.lastID})`);
      }

      done++;
      if (done === total) {
        db.close();
        console.log("Tutti gli utenti sono stati inseriti.");
      }
    });
  });
}


//p123 password docenti
//p456 password studenti

// ESEMPIO: modifica i valori qui sotto
//addUser('Mario', 'mario@exam.com', 'p123', 'teacher');
//addUser('Luigi', 'luigi@exam.com', 'p456', 'student');
addUser('Alberto', 'alberto@exam.com', 'p456', 'student');
addUser('Luca', 'luca@exam.com', 'p456', 'student');
addUser('Gabriele', 'gabriele@exam.com', 'p456', 'student');
addUser('Sandro', 'sandro@exam.com', 'p456', 'student');
addUser('Edoardo', 'edoardo@exam.com', 'p456', 'student');
addUser('Riccardo', 'riccardo@exam.com', 'p456', 'student');
addUser('andrea', 'andrea@exam.com', 'p456', 'student');
addUser('Mattia', 'mattia@exam.com', 'p456', 'student');
addUser('Beatrice', 'beatrice@exam.com', 'p456', 'student');
addUser('Benedetta', 'benedetta@exam.com', 'p456', 'student');
addUser('Giulia', 'giulia@exam.com', 'p456', 'student');
addUser('Miriana', 'miriana@exam.com', 'p456', 'student');
addUser('Asia', 'asia@exam.com', 'p456', 'student');
addUser('Enea', 'enea@exam.com', 'p456', 'student');
addUser('Raffaele', 'raffaele@exam.com', 'p456', 'student');
addUser('Daniela', 'daniela@exam.com', 'p456', 'student');
addUser('Francesca', 'francesca@exam.com', 'p456', 'student');
addUser('Gianmarco', 'gianmarco@exam.com', 'p456', 'student');
addUser('Davide', 'davide@exam.com', 'p456', 'student');
addUser('Pietro', 'pietro@exam.com', 'p456', 'student');
addUser('Sabrina', 'sabrina@exam.com', 'p456', 'student');
addUser('Tommaso', 'tommaso@exam.com', 'p456', 'student');
addUser('Lucio', 'lucio@exam.com', 'p456', 'student');
addUser('Naby', 'naby@exam.com', 'p456', 'student');
addUser('Daniel', 'daniel@exam.com', 'p456', 'student');
addUser('Giacomo', 'giacomo@exam.com', 'p456', 'student');
addUser('Stefano', 'stefano@exam.com', 'p456', 'student');
addUser('Sofia', 'sofia@exam.com', 'p456', 'student');
addUser('Maria', 'maria@exam.com', 'p456', 'student');
addUser('Martina', 'martina@exam.com', 'p456', 'student');
addUser('Lorenza', 'lorenza@exam.com', 'p456', 'student');
addUser('Michela', 'michela@exam.com', 'p456', 'student');
addUser('Aurora', 'aurora@exam.com', 'p456', 'student');
addUser('Lucia', 'lucia@exam.com', 'p456', 'student');
addUser('Arianna', 'arianna@exam.com', 'p456', 'student');
addUser('Federica', 'federica@exam.com', 'p456', 'student');
addUser('Marta', 'marta@exam.com', 'p456', 'student');
addUser('Erika', 'erika@exam.com', 'p456', 'student');
addUser('Francesco', 'francesco@exam.com', 'p456', 'student');
addUser('Filippo', 'filippo@exam.com', 'p456', 'student');




































