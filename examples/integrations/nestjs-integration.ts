/**
 * NestJS Integration Example
 * 
 * This example demonstrates how to integrate @brmorillo/utils with NestJS.
 * 
 * To use this example:
 * 1. Create a new NestJS project: nest new my-project
 * 2. Install @brmorillo/utils: npm install @brmorillo/utils
 * 3. Copy these files to your project
 * 4. Update your app.module.ts to import UtilsModule
 */

// utils.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { Utils } from '@brmorillo/utils';

export interface UtilsModuleOptions {
  logger?: {
    type?: 'pino' | 'winston' | 'console';
    level?: 'error' | 'warn' | 'info' | 'debug';
    prettyPrint?: boolean;
  };
  http?: {
    clientType?: 'axios' | 'http';
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
  };
  storage?: {
    providerType?: 'local' | 's3';
    local?: {
      basePath: string;
      baseUrl?: string;
    };
    s3?: {
      bucket: string;
      region: string;
      accessKeyId?: string;
      secretAccessKey?: string;
      endpoint?: string;
      forcePathStyle?: boolean;
      baseUrl?: string;
    };
  };
}

@Global()
@Module({})
export class UtilsModule {
  static register(options: UtilsModuleOptions = {}): DynamicModule {
    return {
      module: UtilsModule,
      providers: [
        {
          provide: 'UTILS_OPTIONS',
          useValue: options,
        },
        {
          provide: 'UTILS',
          useFactory: (options: UtilsModuleOptions) => {
            return Utils.getInstance(options);
          },
          inject: ['UTILS_OPTIONS'],
        },
      ],
      exports: ['UTILS'],
    };
  }
}

// app.module.ts
import { Module } from '@nestjs/common';
import { UtilsModule } from './utils.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UtilsModule.register({
      logger: {
        type: 'pino',
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        prettyPrint: process.env.NODE_ENV !== 'production',
      },
      http: {
        clientType: 'axios',
        baseUrl: process.env.API_BASE_URL,
        defaultHeaders: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
        },
        timeout: 10000,
      },
      storage: {
        providerType: (process.env.STORAGE_PROVIDER as 'local' | 's3') || 'local',
        local: {
          basePath: './storage',
          baseUrl: `${process.env.APP_URL}/files`,
        },
        s3: {
          bucket: process.env.S3_BUCKET || '',
          region: process.env.AWS_REGION || '',
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}

// users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Utils, HttpError, ValidationError } from '@brmorillo/utils';

interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
}

@Injectable()
export class UsersService {
  private logger;
  private http;
  private storage;

  constructor(@Inject('UTILS') private utils: Utils) {
    this.logger = utils.getLogger();
    this.http = utils.getHttpService();
    this.storage = utils.getStorageService();
  }

  async getUsers() {
    try {
      this.logger.info('Fetching users');
      const response = await this.http.get('/users');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch users', { error });
      throw HttpError.serverError('Failed to fetch users');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    // Validate input
    this.validateCreateUserDto(createUserDto);

    try {
      this.logger.info('Creating user', { email: createUserDto.email });
      const response = await this.http.post('/users', createUserDto);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create user', { error, email: createUserDto.email });
      throw HttpError.serverError('Failed to create user');
    }
  }

  async uploadAvatar(userId: string, avatar: Buffer) {
    try {
      this.logger.info('Uploading avatar', { userId });
      const path = `avatars/${userId}.jpg`;
      const url = await this.storage.uploadFile(path, avatar, {
        contentType: 'image/jpeg',
      });
      return url;
    } catch (error) {
      this.logger.error('Failed to upload avatar', { error, userId });
      throw HttpError.serverError('Failed to upload avatar');
    }
  }

  private validateCreateUserDto(dto: CreateUserDto) {
    if (!dto.name) {
      throw ValidationError.required('name');
    }
    
    if (!dto.email) {
      throw ValidationError.required('email');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw ValidationError.invalidFormat('email', 'email address', dto.email);
    }
    
    // Validate age if provided
    if (dto.age !== undefined) {
      if (typeof dto.age !== 'number') {
        throw ValidationError.invalidType('age', 'number', dto.age);
      }
      
      if (dto.age < 18 || dto.age > 120) {
        throw ValidationError.outOfRange('age', 18, 120, dto.age);
      }
    }
  }
}

// users.controller.ts
import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadAvatar(id, file.buffer);
  }
}