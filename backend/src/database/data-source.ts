import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as entities from './entities';

const hasPostgres = !!(process.env.DB_HOST || process.env.DATABASE_URL);

const AppDataSource = new DataSource({
  type: (hasPostgres ? 'postgres' : 'sqlite') as any,
  entities: Object.values(entities).filter((e) => typeof e === 'function') as any,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ...(hasPostgres
    ? {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'auramart',
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }
    : {
        database: process.env.DB_DATABASE || 'auramart.db',
      }),
});

export default AppDataSource;
