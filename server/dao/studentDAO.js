import db from '../db/openDB.js';

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
      LEFT JOIN answers a ON a.taskID = tm.taskID
      WHERE tm.studentID = ? AND t.status = 'open'
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

      resolve(row); 
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
      SELECT 
        t.taskID,
        t.question,
        t.score,
        COUNT(tm2.studentID) AS groupSize
      FROM Tasks t
      JOIN task_Members tm1 ON tm1.taskID = t.taskID AND tm1.studentID = ?
      JOIN task_Members tm2 ON tm2.taskID = t.taskID
      WHERE t.status = 'closed' AND t.score IS NOT NULL
      GROUP BY t.taskID
    `;

    db.all(sql, [studentID], (err, rows) => {
      if (err) return reject(err);

      let weightedSum = 0;
      let totalWeight = 0;

      for (const row of rows) {
        const weight = 1 / row.groupSize;
        weightedSum += row.score * weight;
        totalWeight += weight;
      }

      const media = totalWeight > 0 ? weightedSum / totalWeight : null;

      resolve({
        compiti: rows.map(r => ({ taskID: r.taskID, question: r.question, score: r.score })),
        media
      });
    });
  });
}



