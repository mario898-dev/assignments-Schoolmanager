// middlewares/Authenticator.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import UserDAO from '../dao/userDAO.js';
import { Utility } from '../utilities/index.js';

export class Authenticator {
  constructor() {
    this.dao = new UserDAO();
    this.configurePassport();
  }

  configurePassport() {
    const self = this;

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    console.log("🔐 Tentativo login per:", email); // 👈 log 1

    try {
      const authenticated = await self.dao.getIsUserAuthenticated(email, password);
      console.log("✅ Password corretta?", authenticated); // 👈 log 2

      if (!authenticated) {
        console.log("❌ Login fallito");
        return done(null, false, { message: 'Credenziali errate' });
      }

      const user = await self.dao.getUserByUsername(email);
      console.log("🎉 Utente trovato:", user); // 👈 log 3

      return done(null, user);
    } catch (err) {
      console.error("💥 Errore autenticazione:", err);
      return done(err);
    }
  }
));



    passport.serializeUser((user, done) => {
      done(null, user.email);
    });

    passport.deserializeUser(async (email, done) => {
      try {
        const user = await this.dao.getUserByUsername(email);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  login(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) return reject(err);
        if (!user) return reject(info);

        req.login(user, err => {
          if (err) return reject(err);
          return resolve(req.user);
        });
      })(req, res, next);
    });
  }

  logout(req, res, next) {
    return new Promise((resolve, reject) => {
      req.logout(() => resolve(null));
    });
  }

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: 'Utente non autenticato' });
  }

  isTeacher(req, res, next) {
    if (req.isAuthenticated() && Utility.isTeacher(req.user)) return next();
    return res.status(403).json({ error: 'Accesso riservato ai docenti' });
  }

  isStudent(req, res, next) {
    if (req.isAuthenticated() && Utility.isStudent(req.user)) return next();
    return res.status(403).json({ error: 'Accesso riservato agli studenti' });
  }
}

export default passport;
