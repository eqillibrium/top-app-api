import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/сreate-review.dto';
import { Types, disconnect } from 'mongoose';

const productId = new Types.ObjectId().toHexString()

const testDTO: CreateReviewDto = {
	name: 'Test',
	title: 'Test title',
	description: 'Test description',
	rating: 5,
	productId
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let createdID: string

  beforeEach(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	await app.init();
  });

	it('/review/create (POST)',  async () => {
	return request(app.getHttpServer())
		.post('/review/create')
		.send(testDTO)
		.expect(201)
		.then(({ body }: request.Response) => {
			createdID = body._id
			expect(createdID).toBeDefined()
		})
  });

	it('/review/byProduct/:productId (GET)', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1)
			})
	});

	it('/review/:id (DELETE)',  () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdID)
			.expect(200)
	});

	afterAll(() => {
		disconnect()
	})
});
