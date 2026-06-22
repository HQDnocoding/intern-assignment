import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer'

const uploadDir = './uploads/avatars';
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

export const avatarMulterConfig = {
    storage: memoryStorage(),
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(
                new BadRequestException('Only JPG, PNG, or WEBP image files are allowed'),
                false,
            );
        }
        cb(null, true);
    },
    limits: { fileSize: 15 * 1024 * 1024 }, // 5MB
};
