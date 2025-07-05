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
      SELECT T.taskID, T.question, T.status, T.score, T.answer_text AS risposta
      FROM Tasks T
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
        return reject(new Error('Compito non trovato o già valutato'));
      }
      resolve(true);
    });
  });
}

export function getClassSummary(teacherId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.userID AS id,
        u.name,
        SUM(CASE WHEN t.status = 'open' THEN 1 ELSE 0 END) AS aperti,
        SUM(CASE WHEN t.status = 'closed' THEN 1 ELSE 0 END) AS chiusi,
        SUM(CASE WHEN t.status = 'closed' AND t.score IS NOT NULL THEN t.score * (1.0 / sub.groupSize) ELSE 0 END) AS weightedSum,
        SUM(CASE WHEN t.status = 'closed' AND t.score IS NOT NULL THEN (1.0 / sub.groupSize) ELSE 0 END) AS totalWeight
      FROM users u
      LEFT JOIN task_Members tm ON u.userID = tm.studentID
      LEFT JOIN Tasks t ON tm.taskID = t.taskID AND t.teacherID = ?
      LEFT JOIN (
        SELECT taskID, COUNT(*) AS groupSize
        FROM task_Members
        GROUP BY taskID
      ) AS sub ON t.taskID = sub.taskID
      WHERE u.role = 'student'
      GROUP BY u.userID
    `;

    db.all(sql, [teacherId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const result = rows.map(row => ({
          id: row.id,
          name: row.name,
          aperti: row.aperti,
          chiusi: row.chiusi,
          media: row.totalWeight > 0 ? parseFloat((row.weightedSum / row.totalWeight).toFixed(2)) : null
        }));
        resolve(result);
      }
    });
  });
}











