export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
    uploadBuffer(buffer: Buffer, folder: string): Promise<{ secure_url: string }>;
}
