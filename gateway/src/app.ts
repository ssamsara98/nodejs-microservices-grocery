import cors from 'cors';
import e from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import { env } from './config/env.config';

const app = e();

app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/customer', proxy('http://localhost:4001')); // customer
app.use('/shopping', proxy('http://localhost:4003')); // shopping
app.use('/', proxy('http://localhost:4002')); // products

export default app;
