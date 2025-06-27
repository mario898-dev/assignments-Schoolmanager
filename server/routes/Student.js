import express from 'express';
import { getTasksForStudent, saveOrUpdateAnswer, getTaskByID, isStudentInTaskGroup, getStudentGrades } from '../dao/studentDAO.js';

function studentRoutes(auth) {
  const router = express.Router();

  //  GET /api/student/tasks – Compiti assegnati allo studente corrente
  router.get('/student/tasks', auth.isStudent, async (req, res) => {
    try {
      console.log('Chiamata GET /student/tasks da utente:', req.user?.id);

      const studentID = req.user.id;
      const tasks = await getTasksForStudent(studentID);
      res.json(tasks);
    } catch (err) {
      console.error('Errore getTasksForStudent:', err);
      res.status(500).json({ error: 'Errore nel recupero dei compiti' });
      
    }
  });

  //  PUT /api/student/answers/:taskID – Invia/aggiorna la risposta di uno studente
  router.put('/student/answers/:taskID', auth.isStudent, async (req, res) => {
  const studentID = req.user.id;
  const taskID = parseInt(req.params.taskID);
  const { risposta } = req.body;

  if (!risposta || typeof risposta !== 'string') {
    return res.status(400).json({ error: 'Testo della risposta non valido' });
  }

  if (isNaN(taskID)) {
    return res.status(400).json({ error: 'ID del compito non valido' });
  }

  try {
    const task = await getTaskByID(taskID);
    if (!task) return res.status(404).json({ error: 'Compito non trovato' });

    if (task.status === 'closed') {
      return res.status(403).json({ error: 'Compito già valutato, non modificabile' });
    }

    const allowed = await isStudentInTaskGroup(studentID, taskID);
    if (!allowed) {
      return res.status(403).json({ error: 'Accesso non autorizzato a questo compito' });
    }

    await saveOrUpdateAnswer(taskID, risposta);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Errore nel salvataggio della risposta' });
  }
});


router.get('/student/grades', auth.isStudent, async (req, res) => {
  try {
    const studentID = req.user.id;
    const result = await getStudentGrades(studentID);
    res.json(result);
  } catch (err) {
    console.error('Errore getStudentGrades:', err);
    res.status(500).json({ error: 'Errore nel recupero dei punteggi' });
  }
});



  return router;
}

export default studentRoutes;
