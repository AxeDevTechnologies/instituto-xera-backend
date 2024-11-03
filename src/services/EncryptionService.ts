import bcrypt from 'bcrypt';

export class EncryptionService {
    private static readonly saltRounds: number = 10;
    
    public static async encryptPassword(password: string): Promise<string> {
        const hash: string = await bcrypt.hash(password, this.saltRounds);
        return hash;
    }

    public static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}