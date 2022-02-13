import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.rcord';

export const hallOfFameRouter = Router();

hallOfFameRouter.get('/', async (req, res) => {
  const warriors = (await WarriorRecord.listTop(10)).map((warrior, index) => {
    return {
      place: index + 1,
      warrior,
    };
  });
  res.render('hall-of-fame/list', {
    warriors,
  });
});
// http://localhost:3000/hall-of-fame
