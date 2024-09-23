import express from 'express';
import cookieSession from 'cookie-session';
import authRouter from './routes/admin/auth.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['we89j403jnaowehf']
  })
);
app.use(authRouter);  // binds all the routes from auth.js to the app instance

app.listen(port, () => { 
  console.log(`Listening on port ${port}`);
});