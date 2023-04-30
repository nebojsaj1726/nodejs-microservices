import express, { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app: Application = express();

const userServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
});

const orderServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
});

const paymentServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
});

app.use('/users', userServiceProxy);
app.use('/orders', orderServiceProxy);
app.use('/payments', paymentServiceProxy);

const port = 3000;
app.listen(port, () => {
  console.log(`Gateway service listening on port ${port}`);
});
