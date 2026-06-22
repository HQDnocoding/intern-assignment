export const MAIL_SERVICE = 'MAIL_SERVICE';

export interface IMailService {
    sendVerificationEmail(email: string, name: string, token: string): Promise<void>;
}
