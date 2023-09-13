import { User } from './user.entity';
const fields = require('/app/datas/user.seed.json');
const friends = require('/app/datas/friends.seed.json');

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
    user.Game_status = false;
    user.password = 0;
    user.email = '';
    await user.save();
  }

  for (const friend of friends) {
    let user = await User.findOne({ where: { ID: friend.ID } });
    user.Friends = [];
    for (const friendID of friend.Friends)
      user.Friends.push(await User.findOne({ where: { ID: friendID } }));
    await user.save();
  }
};
