import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { getUser, /*getUserByEmail*/ } from './dao/userDAO.js';
import authRoutes from './routes/Auth.js';
import teacherRouter from './routes/Teacher.js';
import studentRouter from './routes/Student.js'

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: 'SchoolManager-2025-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// === Configurazione Passport ===
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async function verify(email, password, cb) {
    try {
      const user = await getUser(email, password);
      if (!user)
        return cb(null, false, { message: 'Incorrect email or password.' });
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// === Middleware di autenticazione ===
export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Utente non autenticato' });
}

export function isTeacher(req, res, next) {
  if (req.isAuthenticated() && req.user?.role === 'teacher') return next();
  return res.status(403).json({ error: 'Accesso riservato ai docenti' });
}

export function isStudent(req, res, next) {
  if (req.isAuthenticated() && req.user?.role === 'student') return next();
  return res.status(403).json({ error: 'Accesso riservato agli studenti' });
}

// === router ===
app.use('/api', authRoutes(passport));
app.use('/api', teacherRouter({ isLoggedIn, isTeacher }));
app.use('/api', studentRouter({ isLoggedIn, isStudent }));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




















