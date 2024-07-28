import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../../auth/controllers/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findOneById(id): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);
    const user: User = await this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async update(userId, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.repository.update(userId, updateUserDto);
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
