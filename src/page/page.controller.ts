import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post, UseGuards,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import { PageModel } from './page.model';
import { FindPageDto } from './dto/find-page.dto';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/created-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { NOT_FOUND_PAGE_ERROR } from './page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() dto: CreatePageDto) {
        return this.pageService.create(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = this.pageService.findByID(id)
        if (!page) {
            throw new NotFoundException(NOT_FOUND_PAGE_ERROR)
        }
        return page
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = this.pageService.findByAlias(alias)
        if (!page) {
            throw new NotFoundException(NOT_FOUND_PAGE_ERROR)
        }
        return page
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedPage = this.pageService.deleteByID(id)
        if (!deletedPage) {
            throw new NotFoundException(NOT_FOUND_PAGE_ERROR)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async patch(@Param('id') id: string, @Body() dto: CreatePageDto) {
        const updatedPage = this.pageService.updateByID(id, dto)
        if (!updatedPage) {
            throw new NotFoundException(NOT_FOUND_PAGE_ERROR)
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindPageDto) {
        return this.pageService.findByCategory(dto.firstCategory)
    }

    @Get('textSearch/:text')
    async textSearch (@Param('text') text: string) {
        return this.pageService.findByText(text)
    }
}
