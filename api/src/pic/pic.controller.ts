import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        let logger, output;
        try {
            let filePath = join(__dirname, '..', '..','public','imgs', filename);
            logger = ["The request is ok", "Request: GET[ /files/:filename ]"];
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            logger = ["The request doesn't work", error];
        }
        Logger.log(logger[0], logger[1]);
    }
}
