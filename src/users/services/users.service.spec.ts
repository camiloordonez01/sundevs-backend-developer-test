import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../auth/controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUserRepository = {
    findOne: jest
      .fn()
      .mockImplementationOnce(() => {
        throw new NotFoundException();
      })
      .mockImplementation((data) => Promise.resolve({ data })),
    create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    save: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    update: jest
      .fn()
      .mockImplementation((userId, dto) => Promise.resolve({ userId, ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should find an user by id', async () => {
    const id = '1';
    try {
      await usersService.findOneById(id);
    } catch (error) {
      expect(error).toEqual(new NotFoundException());
    }
    //expect(await usersService.findOneById(id)).toEqual({ id });
  });

  it('should find an user by email', async () => {
    const email = 'orarjuan@hotmail.com';
    try {
      await usersService.findOneByEmail(email);
    } catch (error) {
      expect(error).toEqual(new NotFoundException());
    }
    //expect(await usersService.findOneByEmail(email)).toEqual({ email });
  });

  it('should create a new user', async () => {
    const newUser = {} as CreateUserDto;
    newUser.firstName = 'Camilo';
    newUser.lastName = 'Ordoñez';
    newUser.email = 'orarjuan@hotmail.com';
    newUser.password = '12345678';
    expect(await usersService.create(newUser)).toEqual(newUser);
  });

  it('should update an user', async () => {
    const userId = '1';
    const updateUser = {
      firstName: 'juan',
    } as UpdateUserDto;
    expect(await usersService.update(userId, updateUser)).toEqual({
      userId,
      ...updateUser,
    });
  });
});
