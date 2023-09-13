import { Match } from './match.entity';
import { User } from '../user/user.entity';
const fields = require('/app/datas/match.seed.json');

export async function seedMatches()  {

  for (const field of fields) {
    const match = new Match();
    const user1 = await User.findOne({ where: { Pseudo: field.ID_user1 } });
    const user2 = await User.findOne({ where: { Pseudo: field.ID_user2 } });
    match.ID_user1 = user1;
    match.ID_user2 = user2;
    match.Score_user1 = field.Score_user1;
    match.Score_user2 = field.Score_user2;
    match.Status = field.Status;
    await match.save();
  }
};