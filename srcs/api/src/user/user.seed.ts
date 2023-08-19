// user.seed.ts
import { User } from './user.entity';
const fields = require('/app/datas/user.seed.json');

export async function seedUsers() {

  for (const field of fields) {
    const user = new User();
    user.ID_19 = field.ID_19;
    user.Pseudo = field.Pseudo;
    user.Avatar = field.Avatar;
    user.Elo = field.Elo;
    user.Actual_skin = field.Actual_skin;
    user.Global_skin = field.Global_skin;
    user.Wins = field.Wins;
    user.Loses = field.Loses;
    user.Last_connection = field.Last_connection;
    let friends = [];
    for (const friend of field.Friends) {
      friends.push(await User.findOne({ where: { ID: friend } }));
    }
    user.Friends = friends;
    await user.save();
  }
};
