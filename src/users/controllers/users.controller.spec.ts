import { UsersController } from './users.controller';
import { UsersService } from './../services/users.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../models/user.entity';

describe('UsersController', () => {
  let userController: UsersController;

  const mockUsersService = {
    findOneById: jest
      .fn()
      .mockImplementationOnce(() => {
        throw new NotFoundException();
      })
      .mockImplementationOnce((userId) => Promise.resolve({ userId })),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    update: jest
      .fn()
      .mockImplementationOnce((userId, dto) =>
        Promise.resolve({ userId, ...dto }),
      ),
    encryptPassword: jest.fn(),
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    userController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should assign a role for user', async () => {
    const userId = '1';
    const role = Role.AGENT;
    try {
      await userController.assignRole(userId, { role });
    } catch (error) {
      expect(error).toEqual(new NotFoundException());
    }
    expect(await userController.assignRole(userId, { role })).toEqual(true);
  });
});
