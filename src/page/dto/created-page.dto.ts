import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LevelCategory } from '../page.model';

export class HhDataDto {
    @IsNumber()
    count: number;

    @IsNumber()
    juniorSalary: number;

    @IsNumber()
    middleSalary: number;

    @IsNumber()
    seniorSalary: number;

    @IsString()
    updatedAt: Date;
}

export class PageAdvantageDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreatePageDto {
    @IsEnum(LevelCategory)
    firstCategory: LevelCategory;

    @IsString()
    secondCategory: string;

    @IsString()
    alias: string;

    @IsString()
    title: string;

    @IsString()
    metaTitle: string;

    @IsString()
    metaDescription: string;

    @IsString()
    category: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HhDataDto)
    hh?: HhDataDto;

    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => PageAdvantageDto)
    advantages?: PageAdvantageDto[];

    @IsString()
    @IsOptional()
    seoText?: string;

    @IsString()
    tagsTitle: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
