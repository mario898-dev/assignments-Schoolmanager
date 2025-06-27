import db from '../db/openDB.js';

/**
 * Restituisce tutti i compiti assegnati a uno studente,
 * con eventuale risposta (se già fornita).
 */
export function getTasksForStudent(studentID) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        t.taskID,
        t.question,
        t.status,
        a.answer_text AS risposta
      FROM task_Members tm
      JOIN Tasks t ON t.taskID = tm.taskID
      LEFT JOIN answers a 
        ON a.taskID = tm.taskID
      WHERE tm.studentID = ?
    `;

    db.all(sql, [studentID], (err, rows) => {
      if (err) {
        return reject(err);
      }

      const tasks = rows.map(row => ({
        taskID: row.taskID,
        question: row.question,
        risposta: row.risposta || '',
        status: row.status
      }));

      resolve(tasks);
    });
  });
}


/**
 * Salva o aggiorna la risposta di uno studente a un compito.
 * Se esiste già, la aggiorna.
 */
export function saveOrUpdateAnswer(taskID, answerText) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO answers (taskID, answer_text)
      VALUES (?, ?)
      ON CONFLICT(taskID)
      DO UPDATE SET answer_text = excluded.answer_text
    `;
    db.run(sql, [taskID, answerText], function (err) {
      if (err) return reject(err);
      resolve(true);
    });
  });
}


export function getTaskByID(taskID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT taskID, status FROM Tasks WHERE taskID = ?`;

    db.get(sql, [taskID], (err, row) => {
      if (err) {
        return reject(err);
      }

      resolve(row); // può essere undefined se il task non esiste
    });
  });
}

export function isStudentInTaskGroup(studentID, taskID) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 1 FROM task_Members
      WHERE studentID = ? AND taskID = ?
      LIMIT 1
    `;
    db.get(sql, [studentID, taskID], (err, row) => {
      if (err) return reject(err);
      resolve(!!row);
    });
  });
}

export function getStudentGrades(studentID) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.taskID, t.question, t.score
      FROM Tasks t
      JOIN task_Members tm ON tm.taskID = t.taskID
      WHERE tm.studentID = ? AND t.status = 'closed' AND t.score IS NOT NULL
    `;

    db.all(sql, [studentID], (err, rows) => {
      if (err) return reject(err);

      const media = rows.length
        ? rows.reduce((acc, r) => acc + r.score, 0) / rows.length
        : null;

      resolve({
        compiti: rows,   // Array di { taskID, question, score }
        media: media,
      });
    });
  });
}


