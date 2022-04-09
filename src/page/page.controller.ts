import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { PageModel } from './page.model';
import { FindPageDto } from './dto/find-page.dto';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/created-page.dto';

@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) {}

    @Post('create')
    async create(@Body() dto: CreatePageDto) {

    }

    @Get(':id')
    async get(@Param('id') id: string) {

    }

    @Delete(':id')
    async delete(@Param('id') id: string) {

    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() dto: PageModel) {

    }

    @HttpCode(200)
    @Post()
    async find(@Body() dto: FindPageDto) {

    }
}
