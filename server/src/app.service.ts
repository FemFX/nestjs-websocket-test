import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
}
