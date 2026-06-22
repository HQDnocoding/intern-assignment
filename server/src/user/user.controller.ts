import {
    Controller,
    Get,
    Patch,
    Req,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { UserService } from './user.service.js';
import { avatarMulterConfig } from './multer.config.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@UseGuards(JwtAccessGuard)
@Controller('me')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    getMe(@Req() req: any) {
        return this.userService.getMe(req.user.userId);
    }

    @Patch()
    @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
    async updateProfile(
        @Req() req: any,
        @Body() dto: UpdateProfileDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                }),
        )
        avatar?: Express.Multer.File,
    ) {
        return this.userService.updateProfile(req.user.userId, dto, avatar);
    }
}
