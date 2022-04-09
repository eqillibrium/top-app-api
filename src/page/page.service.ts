import { Inject, Injectable } from '@nestjs/common';
import { PageModel } from './page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePageDto } from './dto/created-page.dto';

@Injectable()
export class PageService {
    constructor(@Inject(PageModel) private readonly pageModel: ModelType<PageModel>) {}

    async create(dto: CreatePageDto) {
        return this.pageModel.create(dto)
    }
}
