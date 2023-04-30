import { DataSource } from 'typeorm';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import indexRoutes from './src/routes/index';

const app: Application = express();

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/src/entities/*.ts'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

app.use(express.json());
app.use(indexRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Orders service is running on port ${port}`);
});
