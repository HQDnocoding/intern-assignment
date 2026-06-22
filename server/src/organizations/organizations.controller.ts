import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { OrganizationsService } from './organizations.service.js';

@UseGuards(JwtAccessGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationsService: OrganizationsService) { }

    @Get()
    list(@Req() req: any) {
        return this.organizationsService.listForUser(req.user.userId);
    }

    @Post()
    create(@Req() req: any, @Body() dto: CreateOrganizationDto) {
        return this.organizationsService.create(req.user.userId, dto);
    }

    @Get(':id')
    getById(@Req() req: any, @Param('id') id: string) {
        return this.organizationsService.getById(req.user.userId, id);
    }

    @Get(':id/dashboard')
    getDashboard(@Req() req: any, @Param('id') id: string) {
        return this.organizationsService.getDashboard(req.user.userId, id);
    }
}
