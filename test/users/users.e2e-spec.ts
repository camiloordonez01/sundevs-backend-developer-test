import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/models/user.entity';

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('SalesController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    findOne: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ ...user, id: 1, role: 'admin' }),
      ),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
      ],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
      }),
    );
    await app.init();
  });

  async function getValidToken() {
    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'demo@demo.com',
      password: 'demo',
    });
    return access_token;
  }

  it('/api/users/{userId}/role (POST)', async () => {
    const data = {
      role: 'ghost',
    };
    return request(app.getHttpServer())
      .post('/api/users/1/role')
      .auth(await getValidToken(), { type: 'bearer' })
      .send(data)
      .expect(201)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('true');
  });
});
