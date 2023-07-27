import { Logger } from '@nestjs/common';
import { User } from './user.entity';
const fields = require('/app/datas/user.json');

export async function createInitialDataUser() {
  try {
    for (const field of fields) {
      const newUser = new User();
      newUser.Avatar = field.Avatar;
      newUser.ID19 = field.ID19;
      newUser.Pseudo = field.Pseudo;
      newUser.save();
    }
    Logger.log('Data inserted successfully.');
  } catch (error) {
    Logger.log(`Error inserting data: ${error.message}`);
  }
}