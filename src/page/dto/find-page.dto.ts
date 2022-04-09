import { LevelCategory } from '../page.model';
import { IsEnum } from 'class-validator';

export class FindPageDto {
    @IsEnum(LevelCategory)
    firstCategory: LevelCategory
}
