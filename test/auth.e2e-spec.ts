import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDTO: AuthDto = {
    email: 'test1@mail.com',
    password: '12345'
}

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let token: string
    let createdID: string

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST) - success',  async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDTO)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.access_token).toBeDefined()
            })
    });

    it('/auth/login (POST) - fail',  async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDTO, password: '1' })
            .expect(401, {
                statusCode: 401,
                message: 'Указанный пароль не совпадает с существующим!',
                error: 'Unauthorized'
            })
    });

    it('/auth/login (POST) - not found',  async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDTO, email: '1' })
            .expect(401, {
                statusCode: 401,
                message: 'Пользователь с таким email не найден!',
                error: 'Unauthorized'
            })
    });

    afterAll(() => {
        disconnect()
    })
});
