import { Conv } from './conv.entity';
import { User } from '../user/user.entity';
const fields = require('/app/datas/conv.seed.json');

export async function seedConvs() {

    for (const field of fields) {
        let user = [];
        for (const userField of field.ID_users) {
            user.push(await User.findOne({ where: { Pseudo: userField } }));
        }

        const conversation = new Conv();
        conversation.Name = field.Name;
        conversation.Users = user;
        conversation.Admin = user[0];
        conversation.Status = field.Status;
        conversation.Messages = field.Messages;
        if (field.Status === 1) {
            conversation.Password = field.Password;
        }
        await conversation.save();
    }
};
