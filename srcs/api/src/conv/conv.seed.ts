// conv.seed.ts
import { Conv } from './conv.entity';
import { User } from '../user/user.entity';
const fields = require('/app/datas/conv.seed.json');

export async function seedConvs() {

    for (const field of fields) {
        const user1 = await User.findOne({ where: { Pseudo: field.ID_user1 } });
        const user2 = await User.findOne({ where: { Pseudo: field.ID_user2 } });

        const conversation = new Conv();
        conversation.Name = field.Name;
        conversation.Users = [user1, user2];
        conversation.Admin = [user1];
        conversation.Status = field.Status;
        conversation.Messages = field.Messages;

        await conversation.save();
    }
};
