import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';

import passport, { Authenticator } from './auth/Authenticator.js';
import authRoutes from './routes/Auth.js';
import teacherRouter from './routes/Teacher.js';
import studentRouter from './routes/Student.js'

const app = express();
const port = 3001;

// middleware globali
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// sessione e passport INIT — solo qui
app.use(session({
  secret: 'scuolamanager-2025-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// istanza dell'authenticator (per usare login/logout/middleware)
const auth = new Authenticator();

// mount router
app.use('/api', authRoutes(auth));  // passa auth nei router
app.use('/api', teacherRouter(auth));
app.use('/api', studentRouter(auth));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});






















