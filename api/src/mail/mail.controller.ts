import { Controller, Post, Body, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailerService,
    private readonly userService: UserService) {}

  @Post('welcome')
  async sendWelcomeEmail(@Body('email') email: string, @Body('pseudo') pseudo: string) {
      let random = Math.floor(Math.random() * 1000000);
    let logger;
    try {
        const mailOptions = {
            to: email,
            subject: 'Welcome to our app!',
            text: `This is a welcome email for our app ${random}`,
          };
      
        await this.mailService.sendMail(mailOptions);
        await this.userService.passwordReset(pseudo, random);
        logger = ["The request is ok", "Request: POST[ /mail/welcome ]"];
    } catch (error) {
        logger = ["The request doesn't work", error];
    }
    Logger.log(logger[0], logger[1]);
    return random;
  }
}
