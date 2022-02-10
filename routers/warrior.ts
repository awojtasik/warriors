import { Router } from 'express';

export const warriorRouter = Router();

warriorRouter
  .get('/add-form', (req, res) => {
    res.render('warrior/add-form');
  })
  .post('/', (req, res) => {
    res.render('warrior/added');
  });
// http://localhost:3000/warrior/add-form
