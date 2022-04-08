import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/сreate-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString()

const loginDTO: AuthDto = {
	email: 'test1@mail.com',
	password: '12345'
}

const testDTO: CreateReviewDto = {
	name: 'Test',
	title: 'Test title',
	description: 'Test description',
	rating: 5,
	productId
}

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let token: string
  let createdID: string

  beforeEach(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	await app.init();

	const { body } = await request(app.getHttpServer())
		.post('/auth/login')
		.send(loginDTO)
	  token = body.access_token
  });

	it('/review/create (POST) - success',  async () => {
	return request(app.getHttpServer())
		.post('/review/create')
		.send(testDTO)
		.expect(201)
		.then(({ body }: request.Response) => {
			createdID = body._id
			expect(createdID).toBeDefined()
		})
  });

	it('/review/byProduct/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1)
			})
	});

	it('/review/byProduct/:productId (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0)
			})
	});

	it('/review/:id (DELETE) - success',  () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdID)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
	});

	it('/review/:id (DELETE) - fail',  () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			})
	});

	afterAll(() => {
		disconnect()
	})
});
