import { Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { MatchService } from './match.service';


@Controller('/match')
export class MatchController {
    constructor(private MatchService: MatchService) {}

    @Get(':id')
    async getMatch(@Param('id') id: string) {
      let output = {};
      let logger = "";
      try {
        let match = await this.MatchService.findOne(Number(id));
        logger = 'MatchController getMatch: ' + id;
        output = match;
      } catch (error) {
        logger = 'MatchController getMatch: ' + id + ' // Error in request';
        output = {error: 'The request failed'};
      }
      Logger.log(logger, 'Request GET');
      return  JSON.stringify(output);
    }
  }