import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.rcord';

export const warriorRouter = Router();

warriorRouter
  .get('/add-form', (req, res) => {
    res.render('warrior/add-form');
  })
  .post('/', async (req, res) => {
    const warrior = new WarriorRecord({
      ...req.body,
      power: Number(req.body.power),
      defence: Number(req.body.defence),
      stamina: Number(req.body.stamina),
      agility: Number(req.body.agility),
    });
    await warrior.insert();
    res.render('warrior/warrior-added');
  });
// http://localhost:3000/warrior/add-form
