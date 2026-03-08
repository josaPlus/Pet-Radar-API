import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';
import { EmailOptions } from 'src/core/models/email-options.model';

@Injectable()
export class EmailService {

    private transporteR = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_PASWORD,
        },
    })

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            await this.transporteR.sendMail({
                to: options.to,
                subject: options.subject,
                html: options.htmlBody,
            })
            return true
        } catch (error) {
            console.error("Error al enviar el correo: ", error)
            return false
        }
    }
}
