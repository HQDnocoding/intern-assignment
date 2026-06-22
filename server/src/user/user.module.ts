import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { CloudinaryService } from './cloudinary.util.js';
import { STORAGE_SERVICE } from '../common/interfaces/storage.interface.js';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        CloudinaryService,
        { provide: STORAGE_SERVICE, useExisting: CloudinaryService },
    ],
    exports: [UserService, STORAGE_SERVICE],
})
export class UserModule { }
