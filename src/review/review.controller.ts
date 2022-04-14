import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { CreateReviewDto } from './dto/сreate-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly telegramService: TelegramService
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto:CreateReviewDto) {
        return this.reviewService.create(dto)
    }

    @UsePipes(new ValidationPipe())
    @Post('notify')
    async notify(@Body() dto:CreateReviewDto) {
        const message = `Имя: ${dto.name}\n`
            + `Заголовок: ${dto.title}\n`
            + `Описание: ${dto.description}\n`
            + `Рейтинг: ${dto.rating}\n`
            + `ID продукта: ${dto.productId}`
        return this.telegramService.sendMessage(message)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deleteDc = await this.reviewService.delete(id)
        if (!deleteDc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('byProduct/:productId')
    async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
        console.log(email)
        return this.reviewService.findByProductId(productId)
    }
}
