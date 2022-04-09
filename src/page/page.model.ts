import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, Index, index } from '@typegoose/typegoose';

export enum LevelCategory {
    Courses,
    Services,
    Books,
    Products
}

export class HHData {
    @Prop()
    count: number;

    @Prop()
    juniorSalary: number;

    @Prop()
    middleSalary: number;

    @Prop()
    seniorSalary: number;
}

export class PageAdvantage {
    @Prop()
    title: string;

    @Prop()
    description: string;
}

export interface PageModel extends Base{}
@index({ '$**': 'text' })
export class PageModel extends TimeStamps{

    @Prop({ enum: LevelCategory })
    firstLevelCategory: LevelCategory;

    @Prop()
    secondCategory: string;

    @Prop({ unique: true })
    alias: string

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop({ type: () => HHData })
    hh?: HHData

    @Prop( { type: () => [PageAdvantage] })
    advantages:PageAdvantage[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitle: string;

    @Prop({ type: () => [String] })
    tags: string[];
}
