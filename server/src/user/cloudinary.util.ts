import * as streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCloudinary } from './cloudinary.config.js';
import type { IStorageService } from '../common/interfaces/storage.interface.js';

@Injectable()
export class CloudinaryService implements IStorageService {
    private readonly cloudinary;

    constructor(config: ConfigService) {
        this.cloudinary = createCloudinary(config);
    }

    uploadBuffer(buffer: Buffer, folder: string): Promise<{ secure_url: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                { folder, resource_type: 'image' },
                (error: Error | undefined, result: UploadApiResponse | undefined) => {
                    if (error || !result) return reject(error);
                    resolve(result);
                },
            );
            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    }
}
