import express from 'express';

export default function createAuthRoutes(passport) {
  const router = express.Router();

  // LOGIN
   router.post('/sessions', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message || 'Login fallito' });

      req.login(user, err => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // LOGOUT
  router.delete('/sessions/current', (req, res) => {
    req.logout(() => {
      res.status(204).end();
    });
  });

  // CURRENT SESSION
  router.get('/sessions/current', (req, res) => {
    if (req.isAuthenticated())
      return res.status(200).json(req.user);
    else
      return res.status(401).json({ error: 'Utente non autenticato' });
  });

  return router;
}
