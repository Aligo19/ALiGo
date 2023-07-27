import { Logger } from '@nestjs/common';

import { Match } from './match.entity';
const fields = require('/app/datas/match.json');

export async function createInitialDataMatch() {
  try {
    for (const field of fields) {
      const newMatch = new Match();
      newMatch.Id_user1 = field.Id_user1;
      newMatch.Id_user2 = field.Id_user2;
      newMatch.level = field.level;
      newMatch.score_u1 = field.score_u1;
      newMatch.score_u2 = field.score_u2;
      await newMatch.save();
    }
    Logger.log('Data inserted successfully.');
  } catch (error) {
    Logger.log(`Error inserting data: ${error.message}`);
  }
}