import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  compress?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  memoryUsage: number;
}

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.Redis;
  private subscriber: Redis.Redis;
  private publisher: Redis.Redis;
  private stats: CacheStats;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      hitRate: 0,
      memoryUsage: 0,
    };
  }

  onModuleInit() {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    // Create Redis clients
    this.client = new Redis.Redis(redisConfig);
    this.subscriber = new Redis.Redis(redisConfig);
    this.publisher = new Redis.Redis(redisConfig);

    // Set up event handlers
    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
    });

    // Set up pub/sub for cache invalidation
    this.subscriber.on('message', (channel, message) => {
      this.handleCacheInvalidation(channel, message);
    });

    // Subscribe to cache invalidation channels
    this.subscriber.subscribe('cache:invalidate');
    this.subscriber.subscribe('cache:clear');

    // Start stats collection
    this.startStatsCollection();
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.subscriber.disconnect();
    this.publisher.disconnect();
  }

  // Basic cache operations
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      const value = await this.client.get(fullKey);
      
      if (value === null) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      this.stats.hits++;
      this.updateHitRate();

      // Parse JSON value
      const parsed = JSON.parse(value);
      
      // Check if value has expired (for custom expiration logic)
      if (parsed._expires && parsed._expires < Date.now()) {
        await this.delete(key, options);
        return null;
      }

      return parsed.data as T;
    } catch (error) {
      console.error(`Cache get error for key ${fullKey}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    const fullKey = this.buildKey(key, options?.prefix);
    const ttl = options?.ttl || this.defaultTTL;

    try {
      const data = {
        data: value,
        _created: Date.now(),
        _expires: ttl > 0 ? Date.now() + ttl * 1000 : null,
      };

      const serialized = JSON.stringify(data);
      
      if (ttl > 0) {
        await this.client.setex(fullKey, ttl, serialized);
      } else {
        await this.client.set(fullKey, serialized);
      }

      this.stats.sets++;
      
      // Emit cache set event
      this.eventEmitter.emit('cache.set', { key: fullKey, ttl });

      return true;
    } catch (error) {
      console.error(`Cache set error for key ${fullKey}:`, error);
      return false;
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<boolean> {
    const fullKey = this.buildKey(key, options?.prefix);

    try {
      const result = await this.client.del(fullKey);
      
      if (result > 0) {
        this.stats.deletes++;
        
        // Publish invalidation event
        await this.publisher.publish('cache:invalidate', JSON.stringify({ key: fullKey }));
        
        // Emit cache delete event
        this.eventEmitter.emit('cache.delete', { key: fullKey });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Cache delete error for key ${fullKey}:`, error);
      return false;
    }
  }

  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      const exists = await this.client.exists(fullKey);
      return exists === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${fullKey}:`, error);
      return false;
    }
  }

  // Batch operations
  async mget<T>(keys: string[], options?: CacheOptions): Promise<Map<string, T | null>> {
    const fullKeys = keys.map(key => this.buildKey(key, options?.prefix));
    
    try {
      const values = await this.client.mget(...fullKeys);
      const result = new Map<string, T | null>();

      keys.forEach((key, index) => {
        const value = values[index];
        if (value) {
          try {
            const parsed = JSON.parse(value);
            result.set(key, parsed.data as T);
            this.stats.hits++;
          } catch {
            result.set(key, null);
            this.stats.misses++;
          }
        } else {
          result.set(key, null);
          this.stats.misses++;
        }
      });

      this.updateHitRate();
      return result;
    } catch (error) {
      console.error('Cache mget error:', error);
      return new Map(keys.map(key => [key, null]));
    }
  }

  async mset<T>(items: Map<string, T>, options?: CacheOptions): Promise<boolean> {
    const ttl = options?.ttl || this.defaultTTL;
    const pipeline = this.client.pipeline();

    try {
      for (const [key, value] of items) {
        const fullKey = this.buildKey(key, options?.prefix);
        const data = {
          data: value,
          _created: Date.now(),
          _expires: ttl > 0 ? Date.now() + ttl * 1000 : null,
        };
        const serialized = JSON.stringify(data);

        if (ttl > 0) {
          pipeline.setex(fullKey, ttl, serialized);
        } else {
          pipeline.set(fullKey, serialized);
        }
      }

      await pipeline.exec();
      this.stats.sets += items.size;
      
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  // Pattern-based operations
  async deletePattern(pattern: string, options?: CacheOptions): Promise<number> {
    const fullPattern = this.buildKey(pattern, options?.prefix);
    
    try {
      const keys = await this.client.keys(fullPattern);
      
      if (keys.length === 0) {
        return 0;
      }

      const result = await this.client.del(...keys);
      this.stats.deletes += result;
      
      // Publish invalidation event
      await this.publisher.publish('cache:invalidate', JSON.stringify({ pattern: fullPattern }));
      
      return result;
    } catch (error) {
      console.error(`Cache delete pattern error for ${fullPattern}:`, error);
      return 0;
    }
  }

  async clear(prefix?: string): Promise<boolean> {
    try {
      if (prefix) {
        const pattern = this.buildKey('*', prefix);
        await this.deletePattern(pattern);
      } else {
        await this.client.flushdb();
      }
      
      // Publish clear event
      await this.publisher.publish('cache:clear', JSON.stringify({ prefix }));
      
      // Emit cache clear event
      this.eventEmitter.emit('cache.clear', { prefix });
      
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // TTL management
  async getTTL(key: string, options?: CacheOptions): Promise<number> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      const ttl = await this.client.ttl(fullKey);
      return ttl;
    } catch (error) {
      console.error(`Cache getTTL error for key ${fullKey}:`, error);
      return -1;
    }
  }

  async expire(key: string, ttl: number, options?: CacheOptions): Promise<boolean> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      const result = await this.client.expire(fullKey, ttl);
      return result === 1;
    } catch (error) {
      console.error(`Cache expire error for key ${fullKey}:`, error);
      return false;
    }
  }

  // Advanced caching strategies
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions,
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Lock to prevent cache stampede
    const lockKey = `lock:${key}`;
    const lockAcquired = await this.acquireLock(lockKey, 5000); // 5 second lock

    if (!lockAcquired) {
      // Wait and retry
      await this.sleep(100);
      return this.getOrSet(key, factory, options);
    }

    try {
      // Double-check after acquiring lock
      const cachedAfterLock = await this.get<T>(key, options);
      if (cachedAfterLock !== null) {
        return cachedAfterLock;
      }

      // Generate value
      const value = await factory();
      
      // Cache the value
      await this.set(key, value, options);
      
      return value;
    } finally {
      // Release lock
      await this.releaseLock(lockKey);
    }
  }

  // Cache warming
  async warm<T>(
    keys: string[],
    factory: (key: string) => Promise<T>,
    options?: CacheOptions,
  ): Promise<void> {
    const promises = keys.map(async (key) => {
      const value = await factory(key);
      await this.set(key, value, options);
    });

    await Promise.all(promises);
    
    this.eventEmitter.emit('cache.warmed', { keys: keys.length });
  }

  // Lock management for distributed caching
  private async acquireLock(key: string, ttl: number): Promise<boolean> {
    const lockKey = `${key}:lock`;
    const lockValue = `${Date.now()}:${Math.random()}`;
    
    try {
      const result = await this.client.set(
        lockKey,
        lockValue,
        'PX',
        ttl,
        'NX',
      );
      
      return result === 'OK';
    } catch (error) {
      console.error(`Lock acquire error for ${lockKey}:`, error);
      return false;
    }
  }

  private async releaseLock(key: string): Promise<boolean> {
    const lockKey = `${key}:lock`;
    
    try {
      await this.client.del(lockKey);
      return true;
    } catch (error) {
      console.error(`Lock release error for ${lockKey}:`, error);
      return false;
    }
  }

  // Cache invalidation handling
  private handleCacheInvalidation(channel: string, message: string) {
    try {
      const data = JSON.parse(message);
      
      if (channel === 'cache:invalidate') {
        console.log(`Cache invalidation received:`, data);
        // Handle specific invalidation logic if needed
      } else if (channel === 'cache:clear') {
        console.log(`Cache clear received:`, data);
        // Handle cache clear logic if needed
      }
    } catch (error) {
      console.error('Cache invalidation handling error:', error);
    }
  }

  // Statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  async getMemoryUsage(): Promise<number> {
    try {
      const info = await this.client.info('memory');
      const match = info.match(/used_memory:(\d+)/);
      
      if (match) {
        this.stats.memoryUsage = parseInt(match[1], 10);
        return this.stats.memoryUsage;
      }
      
      return 0;
    } catch (error) {
      console.error('Get memory usage error:', error);
      return 0;
    }
  }

  private updateHitRate() {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  private startStatsCollection() {
    // Collect stats every minute
    setInterval(async () => {
      await this.getMemoryUsage();
      
      // Emit stats event
      this.eventEmitter.emit('cache.stats', this.getStats());
    }, 60000);
  }

  // Helper methods
  private buildKey(key: string, prefix?: string): string {
    const appPrefix = this.configService.get('CACHE_PREFIX', 'sinav-tr');
    const parts = [appPrefix];
    
    if (prefix) {
      parts.push(prefix);
    }
    
    parts.push(key);
    
    return parts.join(':');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // List operations for leaderboards
  async zadd(key: string, score: number, member: string, options?: CacheOptions): Promise<boolean> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      await this.client.zadd(fullKey, score, member);
      
      if (options?.ttl) {
        await this.client.expire(fullKey, options.ttl);
      }
      
      return true;
    } catch (error) {
      console.error(`Cache zadd error for key ${fullKey}:`, error);
      return false;
    }
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    options?: CacheOptions & { withScores?: boolean },
  ): Promise<string[] | Array<{ member: string; score: number }>> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      if (options?.withScores) {
        const result = await this.client.zrange(fullKey, start, stop, 'WITHSCORES');
        const members: Array<{ member: string; score: number }> = [];
        
        for (let i = 0; i < result.length; i += 2) {
          members.push({
            member: result[i],
            score: parseFloat(result[i + 1]),
          });
        }
        
        return members;
      } else {
        return await this.client.zrange(fullKey, start, stop);
      }
    } catch (error) {
      console.error(`Cache zrange error for key ${fullKey}:`, error);
      return [];
    }
  }

  async zrevrange(
    key: string,
    start: number,
    stop: number,
    options?: CacheOptions & { withScores?: boolean },
  ): Promise<string[] | Array<{ member: string; score: number }>> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      if (options?.withScores) {
        const result = await this.client.zrevrange(fullKey, start, stop, 'WITHSCORES');
        const members: Array<{ member: string; score: number }> = [];
        
        for (let i = 0; i < result.length; i += 2) {
          members.push({
            member: result[i],
            score: parseFloat(result[i + 1]),
          });
        }
        
        return members;
      } else {
        return await this.client.zrevrange(fullKey, start, stop);
      }
    } catch (error) {
      console.error(`Cache zrevrange error for key ${fullKey}:`, error);
      return [];
    }
  }

  async zrank(key: string, member: string, options?: CacheOptions): Promise<number | null> {
    const fullKey = this.buildKey(key, options?.prefix);
    
    try {
      const rank = await this.client.zrank(fullKey, member);
      return rank;
    } catch (error) {
      console.error(`Cache zrank error for key ${fullKey}:`, error);
      return null;
    }
  }
}
