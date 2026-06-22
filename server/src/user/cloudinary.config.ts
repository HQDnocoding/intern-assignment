import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export function createCloudinary(config: ConfigService) {
    cloudinary.config({
        cloud_name: config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: config.getOrThrow<string>('CLOUDINARY_API_KEY'),
        api_secret: config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });

    return cloudinary;
}
