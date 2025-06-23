import express from 'express';

export default function createAuthRoutes(authenticator) {
  const router = express.Router();

  // LOGIN
  router.post('/sessions', async (req, res, next) => {
    try {
      const user = await authenticator.login(req, res, next);
      res.status(200).json(user);
    } catch (err) {
      res.status(401).json({ error: err.message || 'Login fallito' });
    }
  });

  // LOGOUT
  router.delete('/sessions/current', async (req, res) => {
    await authenticator.logout(req, res);
    res.status(204).end();
  });

  // CURRENT SESSION
  router.get('/sessions/current', authenticator.isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
  });

  return router;
}
