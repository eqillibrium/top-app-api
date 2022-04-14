import { Inject, Injectable } from '@nestjs/common';
import { LevelCategory, PageModel } from './page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePageDto } from './dto/created-page.dto';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class PageService {
    constructor(@InjectModel(PageModel) private readonly pageModel: ModelType<PageModel>) {}

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
        return this.pageModel
            .aggregate()
            .match({
                firstCategory
            })
            .group({
                _id: {
                    secondCategory: '$secondCategory'
                },
                pages: {
                    $push: {
                        alias: '$alias',
                        title: '$title'
                    }
                }
            })
            .exec()
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
