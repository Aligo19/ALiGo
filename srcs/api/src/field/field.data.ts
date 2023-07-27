import { Logger } from '@nestjs/common';
import { Field } from './field.entity';
const fields = require('/app/datas/fields.json');

export async function createInitialData() {
  try {
    for (const field of fields) {
      const newField = new Field();
      newField.name = field.name;
      newField.status = field.status;
      await newField.save();
    }

    Logger.log('Data inserted successfully.');
  } catch (error) {
    Logger.log(`Error inserting data: ${error.message}`);
  }
}


