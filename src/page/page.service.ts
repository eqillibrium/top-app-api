import { Inject, Injectable } from '@nestjs/common';
import { LevelCategory, PageModel } from './page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePageDto } from './dto/created-page.dto';

@Injectable()
export class PageService {
    constructor(@Inject(PageModel) private readonly pageModel: ModelType<PageModel>) {}

    async create(dto: CreatePageDto) {
        return this.pageModel.create(dto)
    }

    async findByID (id: string) {
        return this.pageModel.findById(id).exec()
    }

    async findByAlias(alias: string) {
        return this.pageModel.findOne({ alias }).exec()
    }

    async findByCategory(firstCategory: LevelCategory) {
        return this.pageModel.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 }).exec()
    }

    async findByText(text: string) {
        return this.pageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec()
    }

    async deleteByID (id: string) {
        return this.pageModel.findByIdAndRemove(id).exec()
    }

    async updateByID (id: string, dto: CreatePageDto) {
        return this.pageModel.findByIdAndUpdate(id, CreatePageDto, {  new: true}).exec()
    }
}
