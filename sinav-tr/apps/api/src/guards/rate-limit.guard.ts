import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import NodeCache from 'node-cache';

interface RateLimitOptions {
  points: number;
  duration: number; // in seconds
  blockDuration?: number; // in seconds
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private cache: NodeCache;

  constructor(private reflector: Reflector) {
    this.cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const options = this.reflector.get<RateLimitOptions>('rateLimit', context.getHandler()) || {
      points: 100,
      duration: 60,
      blockDuration: 60,
    };

    const key = this.getKey(request);
    const now = Date.now();
    const record = this.cache.get<{ count: number; resetTime: number; blocked?: boolean }>(key);

    if (record?.blocked) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!record || now > record.resetTime) {
      // Create new record
      this.cache.set(key, {
        count: 1,
        resetTime: now + options.duration * 1000,
      }, options.duration);
      return true;
    }

    if (record.count >= options.points) {
      // Block the user
      const blockDuration = options.blockDuration || options.duration;
      this.cache.set(key, {
        ...record,
        blocked: true,
        resetTime: now + blockDuration * 1000,
      }, blockDuration);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. You have been temporarily blocked.',
          retryAfter: blockDuration,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    this.cache.set(key, {
      ...record,
      count: record.count + 1,
    }, Math.ceil((record.resetTime - now) / 1000));

    return true;
  }

  private getKey(request: any): string {
    const userId = request.user?.id;
    const ip = request.ip || request.connection.remoteAddress;
    
    // Prioritize user ID over IP for authenticated users
    if (userId) {
      return `rate_limit:user:${userId}`;
    }
    
    return `rate_limit:ip:${ip}`;
  }
}

// Decorator for custom rate limits
export function RateLimit(options: RateLimitOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('rateLimit', options, descriptor.value);
    return descriptor;
  };
}
