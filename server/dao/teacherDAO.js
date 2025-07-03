import db from '../db/openDB.js';

export function getAllStudents() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT userID, name, email FROM users WHERE role = 'student'`;
    db.all(sql, (err, rows) => {
      if (err) return reject(err);
      const studenti = rows.map(row => ({
        id:    row.userID,
        name:  row.name,
        email: row.email
      }));
      resolve(studenti);
    });
  });
}

export function createTask(teacherId, question, studentIds) {
  return new Promise((resolve, reject) => {
    const insertTaskSql = `INSERT INTO Tasks (teacherID, question, status) VALUES (?, ?, 'open')`;
    db.run(insertTaskSql, [teacherId, question], function (err) {
      if (err) {
        reject(err);
        return;
      }
      const taskId = this.lastID;
      const insertStudentSql = `INSERT INTO task_Members (taskID, studentID) VALUES (?, ?)`;

      let completed = 0;
      for (const sid of studentIds) {
        db.run(insertStudentSql, [taskId, sid], (err) => {
          if (err) {
            reject(err);
            return;
          }

          completed++;
          if (completed === studentIds.length) {
            resolve(taskId);
          }
        });
      }
    });
  });
}


export function checkGroupValidity(studentIds, teacherId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(DISTINCT tm1.taskID) AS count
      FROM task_Members tm1
      JOIN task_Members tm2 ON tm1.taskID = tm2.taskID
      JOIN Tasks t ON t.taskID = tm1.taskID
      WHERE tm1.studentID = ? AND tm2.studentID = ? AND t.teacherID = ?
    `;

    let invalid = false;
    let checks = 0;
    const totalChecks = (studentIds.length * (studentIds.length - 1)) / 2;

    for (let i = 0; i < studentIds.length; i++) {
      for (let j = i + 1; j < studentIds.length; j++) {
        const id1 = studentIds[i];
        const id2 = studentIds[j];

        db.get(sql, [id1, id2, teacherId], (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row.count >= 2) {
            resolve(false);
            invalid = true;
            return;
          }

          checks++;
          if (checks === totalChecks && !invalid) {
            resolve(true);
          }
        });
      }
    }

    if (studentIds.length < 2) resolve(true);
  });
}

export function getTasksByTeacher(teacherID) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT T.taskID, T.question, T.status, T.score, A.answer_text AS risposta
      FROM Tasks T
      LEFT JOIN answers A ON A.taskID = T.taskID
      WHERE T.teacherID = ?
    `;
    db.all(sql, [teacherID], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function valutaCompito(taskID, teacherID, score) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE Tasks
      SET score = ?, status = 'closed'
      WHERE taskID = ? AND teacherID = ? AND status = 'open'
    `;
    db.run(sql, [score, taskID, teacherID], function (err) {
      if (err) {
        return reject(err);
      }
      if (this.changes === 0) {
        // Nessun compito aggiornato → non trovato, o non modificabile
        return reject(new Error('Compito non trovato o già valutato'));
      }
      resolve(true);
    });
  });
}

export function getClassSummary(teacherID) {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT u.userID AS id,
             u.name,
             COUNT(CASE WHEN t.status = 'open' THEN 1 END) AS aperti,
             COUNT(CASE WHEN t.status = 'closed' THEN 1 END) AS chiusi,
             ROUND(AVG(CASE WHEN t.status = 'closed' THEN t.score END), 2) AS media
      FROM users u
      LEFT JOIN task_Members tm ON u.userID = tm.studentID
      LEFT JOIN Tasks t ON tm.taskID = t.taskID AND t.teacherID = ?
      WHERE u.role = 'student'
      GROUP BY u.userID
    `;

    db.all(sql, [teacherID], (err, rows) => {
      if (err) {
        console.error('Errore query semplificata:', err);

        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}









