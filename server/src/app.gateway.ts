import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    // console.log(socket.id);
    // console.log(socket.handshake.auth);
  }

  handleDisconnect(socket: Socket) {
    // console.log(socket);
  }
  @SubscribeMessage('getMessages')
  async getMessages(socket: Socket, data: any) {
    const messages = await this.messageRepository.find({
      where: {
        fromUser: socket.handshake.query.user as string,
        toUser: data.toUser,
      },
    });
    console.log(messages);

    return messages;

    // console.log(socket.handshake.query.user);
  }
  @SubscribeMessage('newMessage')
  async handleMessage(socket: Socket, data: any) {
    console.log(data);
    const newMessage = await this.messageRepository
      .create({
        toUser: data.toUser,
        text: data.message,
        fromUser: socket.handshake.query.user as string,
      })
      .save();
    this.server.emit('onMessage', {
      newMessage,
    });
  }
}
