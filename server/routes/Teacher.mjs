import express from 'express';
import {
  getAllStudents,
  checkGroupValidity,
  createTask,
  valutaCompito,
  getTasksByTeacher,
  getClassSummary
} from '../dao/teacherDAO.js';

export default function teacherRoutes({ isTeacher }) {
  const router = express.Router();

  router.post('/tasks', isTeacher, async (req, res) => {
    const { domanda, studenti } = req.body;

    if (!Array.isArray(studenti) || typeof domanda !== 'string') {
      return res.status(400).json({ error: 'Dati non validi' });
    }

    try {
      const taskId = await createTask(req.user.id, domanda, studenti);
      res.status(201).json({ success: true, taskId });
    } catch (err) {
      res.status(500).json({ error: 'Errore nella creazione del compito' });
    }
  });

  router.post('/tasks/check-group', isTeacher, async (req, res) => {
    const { studentIds } = req.body;
    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ error: 'Formato dati non valido' });
    }

    if (studentIds.length < 2 || studentIds.length > 6) {
    return res.status(400).json({ error: 'Un gruppo deve avere da 2 a 6 studenti.' });
    }

    try {
      const valido = await checkGroupValidity(studentIds, req.user.id);
      res.json({ valido });
    } catch (err) {
      res.status(500).json({ error: 'Errore nella validazione del gruppo' });
    }
  });

  router.get('/students', isTeacher, async (req, res) => {
    try {
      const studenti = await getAllStudents();
      res.json(studenti);
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero degli studenti' });
    }
  });

  router.get('/teacher/tasks', isTeacher, async (req, res) => {
    const teacherID = req.user.id;
    try {
      const tasks = await getTasksByTeacher(teacherID);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Errore durante il recupero dei compiti' });
    }
  });

  router.put('/teacher/tasks/:taskID/score', isTeacher, async (req, res) => {
    const taskID = parseInt(req.params.taskID);
    const teacherID = req.user.id;
    const { score } = req.body;

    if (isNaN(taskID) || typeof score !== 'number' || score < 0 || score > 30) {
      return res.status(400).json({ error: 'Score non valido' });
    }

    try {
      await valutaCompito(taskID, teacherID, score);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  router.get('/teacher/stato-classe', isTeacher, async (req, res) => {
    try {
      const data = await getClassSummary(req.user.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero dello stato della classe' });
    }
  });

  return router;
}
